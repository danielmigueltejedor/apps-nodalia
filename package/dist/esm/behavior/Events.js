var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __using = (stack, value, async) => {
  if (value != null) {
    if (typeof value !== "object" && typeof value !== "function") __typeError("Object expected");
    var dispose, inner;
    if (async) dispose = value[__knownSymbol("asyncDispose")];
    if (dispose === void 0) {
      dispose = value[__knownSymbol("dispose")];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") __typeError("Object not disposable");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    stack.push([async, dispose, value]);
  } else if (async) {
    stack.push([async]);
  }
  return value;
};
var __callDispose = (stack, error, hasError) => {
  var E = typeof SuppressedError === "function" ? SuppressedError : function(e, s, m, _) {
    return _ = Error(m), _.name = "SuppressedError", _.error = e, _.suppressed = s, _;
  };
  var fail = (e) => error = hasError ? new E(e, error, "An error was suppressed during disposal") : (hasError = true, e);
  var next = (it) => {
    while (it = stack.pop()) {
      try {
        var result = it[1] && it[1].call(it[2]);
        if (it[0]) return Promise.resolve(result).then(next, (e) => (fail(e), next()));
      } catch (e) {
        fail(e);
      }
    }
    if (hasError) throw error;
  };
  return next();
};
/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  asError,
  BasicObservable,
  camelize,
  EventEmitter,
  ImplementationError,
  InternalError,
  Logger,
  MaybePromise,
  Observable,
  QuietObservable,
  Time
} from "#general";
import { ElementTag, EventElement } from "#model";
import { ChangeNotificationService } from "#node/integration/ChangeNotificationService.js";
import { OccurrenceManager } from "#protocol";
import { ClusterId, EventId } from "#types";
import { NodeActivity } from "./context/NodeActivity.js";
const logger = Logger.get("Events");
class Events extends EventEmitter {
  #endpoint;
  #behavior;
  #changes;
  setContext(endpoint, behavior) {
    this.#endpoint = endpoint;
    this.#behavior = behavior;
  }
  /**
   * Emitted when state associated with this behavior is first mutated by a specific interaction.
   */
  interactionBegin = Observable();
  /**
   * Emitted when a mutating interaction completes.
   */
  interactionEnd = Observable();
  /**
   * Emitted when the state of this behavior changes at the end after all concrete $Changed events were emitted.
   */
  stateChanged = Observable();
  get endpoint() {
    return this.#endpoint;
  }
  get behavior() {
    return this.#behavior;
  }
  get changes() {
    if (this.#changes === void 0 && this.#endpoint !== void 0 && this.#endpoint.env.has(ChangeNotificationService)) {
      this.#changes = this.#endpoint.env.get(ChangeNotificationService);
    }
    return this.#changes;
  }
  toString() {
    return `${this.#endpoint ?? "?"}.${this.#behavior?.id ?? "?"}.events`;
  }
}
class ElementEvent extends BasicObservable {
  #schema;
  #owner;
  constructor(schema, owner, errorHandler, promiseHandler) {
    super(errorHandler, promiseHandler);
    this.#schema = schema;
    this.#owner = owner;
  }
  /**
   * The element that triggers this event.
   */
  get schema() {
    return this.#schema;
  }
  get owner() {
    return this.#owner;
  }
}
class OfflineEvent extends ElementEvent {
  constructor(schema, owner) {
    super(
      schema,
      owner,
      void 0,
      async (promise, observer) => {
        var _stack = [];
        try {
          const _actor = __using(_stack, this.owner.endpoint?.env.get(NodeActivity).begin(descriptionOf(this, observer)));
          await promise;
        } catch (_) {
          var _error = _, _hasError = true;
        } finally {
          __callDispose(_stack, _error, _hasError);
        }
      }
    );
  }
}
class OnlineEvent extends ElementEvent {
  isQuieter = false;
  #baseOccurrence;
  #occurrenceTrigger;
  constructor(schema, owner) {
    super(
      schema,
      owner,
      (error, observer) => {
        logger.error(`Error in ${descriptionOf(this, observer)}`, error);
      },
      async (promise, observer) => {
        var _stack = [];
        try {
          const _actor = __using(_stack, this.owner.endpoint?.env.get(NodeActivity).begin(descriptionOf(this, observer)));
          try {
            await promise;
          } catch (e) {
            this.handleError(asError(e), observer);
          }
        } catch (_) {
          var _error = _, _hasError = true;
        } finally {
          __callDispose(_stack, _error, _hasError);
        }
      }
    );
    const eventSchema = this.schema;
    if (this.schema.tag === ElementTag.Event && this.schema.id !== void 0 && this.owner.endpoint !== void 0 && this.owner.behavior !== void 0 && eventSchema.priority !== void 0) {
      this.#baseOccurrence = {
        eventId: EventId(this.schema.id),
        clusterId: ClusterId(this.owner.behavior.schema.id),
        endpointId: this.owner.endpoint.number,
        priority: EventElement.PriorityId[eventSchema.priority]
      };
      this.#connectWithOccurenceManager();
    }
  }
  #connectWithOccurenceManager() {
    if (this.owner.endpoint === void 0) {
      throw new InternalError("Events initialized with no assigned endpoint");
    }
    const occurrenceManager = this.owner.endpoint.env.maybeGet(OccurrenceManager);
    if (occurrenceManager === void 0) {
      return;
    }
    const trigger = (payload) => {
      const occurrence = occurrenceManager.add({
        ...this.#baseOccurrence,
        epochTimestamp: Time.nowMs,
        payload
      });
      if (MaybePromise.is(occurrence)) {
        this.owner.endpoint.env.runtime.add(occurrence.then(this.#broadcast.bind(this)));
      } else {
        this.#broadcast(occurrence);
      }
    };
    this.online.on(trigger);
    this.#occurrenceTrigger = trigger;
  }
  #broadcast({ number, epochTimestamp: timestamp, priority, payload }) {
    this.owner.changes?.broadcastEvent(this.owner.endpoint, this.owner.behavior, this.schema, {
      number,
      timestamp,
      priority,
      payload
    });
  }
  /**
   * An {@link Observable} that emits only those events conveyed between nodes.
   *
   * Normally this is the {@link OnlineEvent}, but in the case of server-side elements that are
   * {@link Quality.quieter} this is {@link quiet}.
   */
  get online() {
    return this;
  }
  /**
   * A quieter version of the {@link OnlineEvent}.
   *
   * Throws if the node is not a server or the associated element is not {@link Quality.quieter}.
   *
   * By default emits latest changes once per second but you can reconfigure via {@link QuietObservable} properties
   * and/or trigger emits using {@link QuietObservable.emitNow} and {@link QuietObservable.emitSoon}.
   */
  get quiet() {
    throw new ImplementationError(`Matter does not define ${this} with "quieter" (Q) quality`);
  }
  toString() {
    const base = `${this.owner.toString()}.${camelize(this.schema.name)}`;
    if (this.schema.tag === ElementTag.Attribute || this.schema.tag === ElementTag.Field) {
      return `${base}$Changed`;
    }
    return base;
  }
  [Symbol.dispose]() {
    if (this.#occurrenceTrigger) {
      this.online.off(this.#occurrenceTrigger);
      this.#occurrenceTrigger = void 0;
    }
  }
}
class QuietEvent extends OnlineEvent {
  isQuieter = true;
  #quiet;
  constructor(schema, owner, config) {
    super(schema, owner);
    this.#quiet = new QuietObservable({
      shouldEmit(...args) {
        const [newValue, oldValue] = args;
        return oldValue === null || newValue === null && oldValue !== newValue ? "now" : true;
      },
      ...config,
      source: this
    });
  }
  get online() {
    return this.#quiet;
  }
  get quiet() {
    return this.#quiet;
  }
  [Symbol.dispose]() {
    this.#quiet[Symbol.dispose]();
    super[Symbol.dispose]();
  }
}
function descriptionOf(observable, observer) {
  let desc = `${observable} observer`;
  if (observer.name) {
    desc = `${desc} ${observer.name}`;
  }
  return desc;
}
export {
  ElementEvent,
  Events,
  OfflineEvent,
  OnlineEvent,
  QuietEvent
};
//# sourceMappingURL=Events.js.map
