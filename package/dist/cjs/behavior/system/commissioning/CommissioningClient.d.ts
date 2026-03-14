/**
 * @license
 * Copyright 2022-2026 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */
import { Behavior } from "#behavior/Behavior.js";
import { Events as BaseEvents } from "#behavior/Events.js";
import { ClassExtends, Duration, Observable, ServerAddress, Timestamp } from "#general";
import type { ClientNode } from "#node/ClientNode.js";
import { CommissioningMode, ControllerCommissioningFlow, DiscoveryData, Fabric, FabricAuthority, PeerAddress as ProtocolPeerAddress, SessionIntervals as ProtocolSessionIntervals, Subscribe } from "#protocol";
import { CaseAuthenticatedTag, DeviceTypeId, DiscoveryCapabilitiesBitmap, FabricIndex, NodeId, TypeFromPartialBitSchema, VendorId } from "#types";
import { RemoteDescriptor } from "./RemoteDescriptor.js";
/**
 * Client functionality related to commissioning.
 *
 * Updates node state based on commissioning status and commissions new nodes.
 */
export declare class CommissioningClient extends Behavior {
    #private;
    state: CommissioningClient.State;
    events: CommissioningClient.Events;
    static readonly early = true;
    static readonly id = "commissioning";
    initialize(options: {
        descriptor?: RemoteDescriptor;
    }): void;
    commission(passcode: number | string): Promise<ClientNode>;
    commission(options: CommissioningClient.CommissioningOptions): Promise<ClientNode>;
    /**
     * Remove this node from the fabric.
     *
     * After removal the {@link ClientNode} remains intact.  You can use {@link ClientNode#delete} to remove the node
     * permanently.
     *
     * Only legal if this node controls the peer's fabric.
     */
    decommission(): Promise<void>;
    /**
     * Override to implement CASE commissioning yourself.
     *
     * If you override, matter.js commissions to the point where commissioning over PASE is complete.  You must then
     * complete commissioning yourself by connecting to the device and invokeint the "CommissioningComplete" command.
     */
    protected finalizeCommissioning(_address: ProtocolPeerAddress, _discoveryData?: DiscoveryData): Promise<void>;
    get descriptor(): RemoteDescriptor | undefined;
    set descriptor(descriptor: RemoteDescriptor | undefined);
}
export declare namespace CommissioningClient {
    /**
     * Concrete version of {@link ProtocolPeerAddress}.
     */
    class PeerAddress implements ProtocolPeerAddress {
        fabricIndex: FabricIndex;
        nodeId: NodeId;
        constructor(fabricIndex: FabricIndex, nodeId: NodeId);
    }
    /**
     * Concrete version of {@link SessionIntervals}.
     */
    class SessionIntervals implements Partial<ProtocolSessionIntervals> {
        idleInterval?: Duration;
        activeInterval?: Duration;
        activeThreshold?: Duration;
        constructor(intervals: SessionIntervals);
    }
    /**
     * The network address of a node.
     */
    class NetworkAddress {
        type: "udp" | "tcp" | "ble";
        ip?: string;
        port?: number;
        peripheralAddress?: string;
        ttl?: Duration | undefined;
        discoveredAt?: Timestamp | undefined;
        constructor(address: NetworkAddress);
    }
    class State {
        /**
         * Fabric index and node ID for paired peers.  If this is undefined the node is uncommissioned.
         */
        peerAddress?: PeerAddress;
        /**
         * Known network addresses for the device.  If this is undefined, the node has not been located on any network
         * interface.
         */
        addresses?: ServerAddress[];
        /**
         * Time at which the device was discovered.
         */
        discoveredAt?: Timestamp;
        /**
         * Time at which we discovered the device's current operational addresses.
         */
        onlineAt?: Timestamp;
        /**
         * Time at which we concluded the device's current operational address is unreachable.
         */
        offlineAt?: Timestamp;
        /**
         * Time at which the device was commissioned.
         */
        commissionedAt?: Timestamp;
        /**
         * The TTL of the discovery record if applicable (in seconds).
         */
        ttl?: Duration;
        /**
         * The canonical global ID of the device.
         */
        deviceIdentifier?: string;
        /**
         * The device's long discriminator.
         */
        discriminator?: number;
        /**
         * The last know commissioning mode of the device.
         */
        commissioningMode?: CommissioningMode;
        /**
         * Vendor.
         */
        vendorId?: VendorId;
        /**
         * Product.
         */
        productId?: number;
        /**
         * Advertised device type.
         */
        deviceType?: DeviceTypeId;
        /**
         * The advertised device name specified by the user.
         */
        deviceName?: string;
        /**
         * An optional manufacturer-specific unique rotating ID for uniquely identifying the device.
         */
        rotatingIdentifier?: string;
        /**
         * A bitmap indicating how to transition the device to commissioning mode from its current state.
         */
        pairingHint?: number;
        /**
         * Textual pairing instructions associated with pairing hint.
         */
        pairingInstructions?: string;
        /**
         * The remote node's session intervals.
         */
        sessionIntervals?: SessionIntervals;
        /**
         * TCP support bitmap.
         */
        tcpSupport?: number;
        /**
         * Indicates whether node is ICD with a slow (15 s+) polling interval.
         */
        longIdleTimeOperatingMode?: boolean;
    }
    class Events extends BaseEvents {
        peerAddress$Changed: Observable<[value: ProtocolPeerAddress | undefined, oldValue: ProtocolPeerAddress | undefined], void>;
        addresses$Changed: Observable<[value: ServerAddress[] | undefined, oldValue: ServerAddress[] | undefined], void>;
    }
    /**
     * Options that control commissioning.
     */
    interface BaseCommissioningOptions {
        /**
         * The ID to assign the node during commissioning.  By default the node receives the next available ID.
         */
        nodeId?: NodeId;
        /**
         * The fabric the node joins upon commissioning.  Defaults to the default fabric of the assigned
         * {@link FabricAuthority}.
         */
        fabric?: Fabric;
        /**
         * The authority controlling the commissioning fabric.  Defaults to the {@link FabricAuthority} of the local
         * environment.
         */
        fabricAuthority?: FabricAuthority;
        /**
         * Custom commissioning flow implementation to use instead of the default.
         */
        commissioningFlowImpl?: ClassExtends<ControllerCommissioningFlow>;
        /**
         * Discovery capabilities to use for discovery. These are included in the QR code normally and defined if BLE
         * is supported for initial commissioning.
         */
        discoveryCapabilities?: TypeFromPartialBitSchema<typeof DiscoveryCapabilitiesBitmap>;
        /**
         * The initial read/subscription used to populate node data.
         *
         * By default, matter.js reads all attributes on the node.  This allows us to efficiently initialize the complete
         * node structure.
         *
         * If you only require a subset of attributes you can replace this with a more discriminative read.  For
         * example, if you are only interested in interacting with the root endpoint and the On/Off cluster on other
         * endpoints, you could do:
         *
         * ```js
         * {
         *     defaultSubscription: Read(
         *         Read.Attribute({ endpoint: 0 }),
         *         Read.Attribute({ cluster: OnOffCluster })
         *     )
         * }
         * ```
         *
         * Note that certain clusters like Descriptor and Basic Information contain critical operational data. If your
         * read omits them then the node will only be partially functional once initialized.
         */
        defaultSubscription?: Subscribe;
        /**
         * By default, nodes we commission are automatically subscribed to using the {@link defaultSubscription} (or a
         * full wildcard subscription if that is undefined).
         *
         * Matter.js will not subscribe automatically if set to false.
         */
        autoSubscribe?: boolean;
        /**
         * Case Authenticated Tags (CATs) to use for operational CASE sessions with this node.
         *
         * CATs provide additional authentication context for Matter operational sessions. They are only used
         * for operational CASE connections after commissioning is complete, not during the initial PASE
         * commissioning process.
         *
         * Note: CATs only make sense when additional ACLs (Access Control Lists) are also configured on
         * the target device to grant specific permissions based on these tags.
         */
        caseAuthenticatedTags?: CaseAuthenticatedTag[];
    }
    interface PasscodeOptions extends BaseCommissioningOptions {
        /**
         * The device's passcode.
         */
        passcode: number;
        /**
         * The device's long discriminator.
         */
        discriminator?: number;
    }
    interface PairingCodeOptions extends BaseCommissioningOptions {
        /**
         * The device's pairing code.
         */
        pairingCode: string;
    }
    type CommissioningOptions = PasscodeOptions | PairingCodeOptions;
    function PasscodeOptions<T extends CommissioningOptions>(options: T): T & PasscodeOptions;
}
//# sourceMappingURL=CommissioningClient.d.ts.map