import { config } from "@matter/nodejs/config";

config.trapProcessSignals = true;
config.setProcessExitCodeOnError = true;
config.loadConfigFile = false;
config.loadProcessArgv = false;
config.loadProcessEnv = false;

function formatUnhandledReason(reason: unknown): string {
  return formatValue(reason, 0);
}

function formatValue(value: unknown, depth: number): string {
  if (value instanceof Error) {
    return formatError(value, depth);
  }

  if (typeof value === "number") {
    return `numeric_reason:${value}`;
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function formatError(error: Error, depth: number): string {
  const lines: string[] = [];
  const pad = "  ".repeat(depth);
  const title = `${error.name}: ${error.message}`;
  lines.push(`${pad}${title}`);

  if (error.stack != null) {
    const stackLines = error.stack
      .split("\n")
      .slice(1)
      .map((line) => `${pad}${line.trimEnd()}`);
    lines.push(...stackLines);
  }

  const aggregate = error as AggregateError & { errors?: unknown[] };
  if (Array.isArray(aggregate.errors) && aggregate.errors.length > 0) {
    for (const nested of aggregate.errors) {
      lines.push(`${pad}  - ${formatValue(nested, depth + 1)}`);
    }
  }

  if ("cause" in error && error.cause != null) {
    lines.push(`${pad}Caused by: ${formatValue(error.cause, depth + 1)}`);
  }

  return lines.join("\n");
}

process.on("unhandledRejection", (reason) => {
  const formatted = formatUnhandledReason(reason);
  // Keep the process alive and log details instead of crashing on detached async rejections.
  console.error(
    `[UnhandledRejection] Captured rejected promise: ${formatted}`,
  );
});
