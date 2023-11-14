import { Onvif, ReferenceToken, SetSystemDateAndTimeOptions } from './onvif';
export interface OnvifService {
    /** Namespace uri */
    namespace: string;
    /** Uri for requests */
    XAddr: string;
    /** Minor version */
    minor: number;
    /** Major version */
    major: number;
}
export interface OnvifVersion {
    /** Major version number */
    major: number;
    /**
     * Two digit minor version number.
     * If major version number is less than "16", X.0.1 maps to "01" and X.2.1 maps to "21" where X stands for Major version number.
     * Otherwise, minor number is month of release, such as "06" for June
     */
    minor: number;
}
export interface NetworkCapabilitiesExtension {
    dot11Configuration?: boolean;
    extension?: any;
}
/** Network capabilities */
export interface NetworkCapabilities {
    /** Indicates support for IP filtering */
    IPFilter?: boolean;
    /** Indicates support for zeroconf */
    zeroConfiguration?: boolean;
    /** Indicates support for IPv6 */
    IPVersion6?: boolean;
    /** Indicates support for dynamic DNS configuration */
    dynDNS?: boolean;
    /** Indicates support for IEEE 802.11 configuration */
    dot11Configuration?: boolean;
    /** Indicates the maximum number of Dot1X configurations supported by the device */
    dot1XConfigurations?: number;
    /** Indicates support for retrieval of hostname from DHCP */
    hostnameFromDHCP?: boolean;
    /** Maximum number of NTP servers supported by the devices SetNTP command */
    NTP: number;
    /** Indicates support for Stateful IPv6 DHCP */
    DHCPv6: boolean;
    extension: NetworkCapabilitiesExtension;
}
export interface SystemCapabilitiesExtension {
    httpFirmwareUpgrade?: boolean;
    httpSystemBackup?: boolean;
    httpSystemLogging?: boolean;
    httpSupportInformation?: boolean;
    extension?: any;
}
/** System capabilities */
export interface SystemCapabilities {
    /** Indicates whether or not WS Discovery resolve requests are supported */
    discoveryResolve: boolean;
    /** Indicates support for WS Discovery resolve requests */
    discoveryBye: boolean;
    /** Indicates support for remote discovery */
    remoteDiscovery: boolean;
    /** Indicates support for system backup through MTOM */
    systemBackup: boolean;
    /** Indicates support for retrieval of system logging through MTOM */
    systemLogging: boolean;
    /** Indicates support for firmware upgrade through MTOM */
    firmwareUpgrade: boolean;
    /** Indicates support for firmware upgrade through HTTP */
    httpFirmwareUpgrade?: boolean;
    /** Indicates support for system backup through HTTP */
    httpSystemBackup?: boolean;
    /** Indicates support for retrieval of system logging through HTTP */
    httpSystemLogging?: boolean;
    /** Indicates supported ONVIF version(s) */
    supportedVersions: OnvifVersion;
    /** Indicates support for retrieving support information through HTTP */
    httpSupportInformation?: boolean;
    /** Indicates support for storage configuration interfaces */
    storageConfiguration?: boolean;
    /** Indicates maximum number of storage configurations supported */
    maxStorageConfigurations?: number;
    /** If present signals support for geo location. The value signals the supported number of entries */
    geoLocationEntries?: number;
    /** List of supported automatic GeoLocation adjustment supported by the device. Valid items are defined by tds:AutoGeoMode */
    autoGeo?: string[];
    /** Enumerates the supported StorageTypes, see tds:StorageType */
    storageTypesSupported?: string[];
    /** Indicates no support for network discovery */
    discoveryNotSupported?: boolean;
    /** Indicates no support for network configuration */
    networkConfigNotSupported?: boolean;
    /** Indicates no support for user configuration */
    userConfigNotSupported?: boolean;
    /** List of supported Addons by the device */
    addons?: string[];
    extensions?: SystemCapabilitiesExtension;
}
export interface IOCapabilitiesExtension {
    auxiliary?: boolean;
    auxiliaryCommands?: Record<string, unknown>;
    extension?: any;
}
export interface IOCapabilities {
    /** Number of input connectors */
    inputConnectors?: number;
    /** Number of relay outputs */
    relayOutputs?: number;
    extension?: IOCapabilitiesExtension;
}
export interface SecurityCapabilitiesExtension2 {
    dot1X: boolean;
    /** EAP Methods supported by the device. The int values refer to the IANA EAP Registry */
    supportedEAPMethod?: number;
    remoteUserHandling: boolean;
}
export interface SecurityCapabilitiesExtension {
    /** Indicates support for TLS 1.0 */
    'TLS1.0': boolean;
    extension?: SecurityCapabilitiesExtension2;
}
/** Security capabilities */
export interface SecurityCapabilities {
    /** Indicates support for TLS 1.1 */
    'TLS1.0'?: boolean;
    /** Indicates support for TLS 1.1 */
    'TLS1.1': boolean;
    /** Indicates support for TLS 1.2 */
    'TLS1.2': boolean;
    /** Indicates support for onboard key generation */
    onboardKeyGeneration: boolean;
    /** Indicates support for access policy configuration */
    accessPolicyConfig: boolean;
    /** Indicates support for the ONVIF default access policy */
    defaultAccessPolicy?: boolean;
    /** Indicates support for IEEE 802.1X configuration */
    dot1X?: boolean;
    /** Indicates support for remote user configuration. Used when accessing another device */
    remoteUserHandling?: boolean;
    /** Indicates support for WS-Security X.509 token */
    'X.509Token': boolean;
    /** Indicates support for WS-Security SAML token */
    SAMLToken: boolean;
    /** Indicates support for WS-Security Kerberos token */
    kerberosToken: boolean;
    /** Indicates support for WS-Security Username token */
    usernameToken?: boolean;
    /** Indicates support for WS over HTTP digest authenticated communication layer */
    httpDigest?: boolean;
    /** Indicates support for WS-Security REL token */
    RELToken: boolean;
    /** EAP Methods supported by the device. The int values refer to the IANA EAP Registry */
    supportedEAPMethods?: number[];
    /** The maximum number of users that the device supports */
    maxUsers?: number;
    /** Maximum number of characters supported for the username by CreateUsers */
    maxUserNameLength?: number;
    /** Maximum number of characters supported for the password by CreateUsers and SetUser */
    maxPasswordLength?: number;
    /** Indicates which security policies are supported. Options are: ModifyPassword, PasswordComplexity, AuthFailureWarnings */
    securityPolicies?: string[];
    /** Maximum number of passwords that the device can remember for each user */
    maxPasswordHistory: number;
    extension?: SecurityCapabilitiesExtension;
}
/**
 * Event capabilities
 */
export interface EventCapabilities {
    /** Event service URI */
    XAddr: string;
    /** Indicates whether or not WS Subscription policy is supported */
    WSSubscriptionPolicySupport: boolean;
    /** Indicates whether or not WS Pull Point is supported */
    WSPullPointSupport: boolean;
    /** Indicates whether or not WS Pausable Subscription Manager Interface is supported */
    WSPausableSubscriptionManagerInterfaceSupport: boolean;
}
export interface ImagingCapabilities {
    /** Imaging service URI */
    XAddr: string;
}
export interface RealTimeStreamingCapabilities {
    /** Indicates whether or not RTP multicast is supported */
    RTPMulticast: boolean;
    /** Indicates whether or not RTP over TCP is supported */
    RTP_TCP: boolean;
    /** Indicates whether or not RTP/RTSP/TCP is supported */
    RTP_RTSP_TCP: boolean;
    /** Extensions */
    extension: any;
}
export interface ProfileCapabilities {
    maximumNumberOfProfiles: number;
}
export interface MediaCapabilitiesExtension {
    profileCapabilities: ProfileCapabilities;
}
export interface MediaCapabilities {
    /** Media service URI */
    XAddr: string;
    /** Streaming capabilities */
    streamingCapabilities: RealTimeStreamingCapabilities;
    extension?: MediaCapabilitiesExtension;
}
/** PTZ capabilities */
export interface PTZCapabilities {
    /** PTZ service URI */
    XAddr: string;
}
export interface DeviceIOCapabilities {
    /** DeviceIO service URI */
    XAddr: string;
    videoSources: number;
    videoOutputs: number;
    audioSources: number;
    audioOutputs: number;
    relayOutputs: number;
    extensions: {
        telexCapabilities: any;
        scdlCapabilities: any;
    };
}
export interface DisplayCapabilities {
    XAddr: string;
    /** Indication that the SetLayout command supports only predefined layouts */
    fixedLayout: boolean;
}
export interface RecordingCapabilities {
    XAddr: string;
    receiverSource: boolean;
    mediaProfileSource: boolean;
    dynamicRecordings: boolean;
    dynamicTracks: boolean;
    maxStringLength: number;
}
export interface SearchCapabilities {
    XAddr: string;
    metadataSearch: boolean;
}
export interface ReplayCapabilities {
    XAddr: string;
}
export interface ReceiverCapabilities {
    /** The address of the receiver service */
    XAddr: string;
    /** Indicates whether the device can receive RTP multicast streams */
    RTP_Multicast: boolean;
    /** Indicates whether the device can receive RTP/TCP streams */
    RTP_TCP: boolean;
    /** Indicates whether the device can receive RTP/RTSP/TCP streams */
    RTP_RTSP_TCP: boolean;
    /** The maximum number of receivers supported by the device */
    supportedReceivers: number;
    /** The maximum allowed length for RTSP URIs */
    maximumRTSPURILength: number;
}
export interface AnalyticsDeviceCapabilities {
    XAddr: string;
    ruleSupport?: boolean;
    extension?: any;
}
export interface CapabilitiesExtension {
    XAddr: string;
    /** DeviceIO capabilities */
    deviceIO?: DeviceIOCapabilities;
    display?: DisplayCapabilities;
    recording?: RecordingCapabilities;
    search?: SearchCapabilities;
    replay?: ReplayCapabilities;
    receiver?: ReceiverCapabilities;
    analyticsDevice?: AnalyticsDeviceCapabilities;
}
/** Device capabilities */
export interface DeviceCapabilities {
    /** Device service URI */
    XAddr: string;
    network?: NetworkCapabilities;
    system?: SystemCapabilities;
    IO?: IOCapabilities;
    security?: SecurityCapabilities;
    extensions?: any;
}
/** Analytics capabilities */
export interface AnalyticsCapabilities {
    /** Analytics service URI */
    XAddr: string;
    /** Indicates whether rules are supported */
    ruleSupport: boolean;
    /** Indicates whether modules are supported */
    analyticsModuleSupport: boolean;
}
/**
 * Capability list
 */
export interface Capabilities {
    analytics?: AnalyticsCapabilities;
    device?: DeviceCapabilities;
    events?: EventCapabilities;
    imaging?: ImagingCapabilities;
    media?: MediaCapabilities;
    ptz?: PTZCapabilities;
    extension?: CapabilitiesExtension;
}
export interface HostnameInformation {
    /** Indicates whether the hostname is obtained from DHCP or not */
    fromDHCP: boolean;
    /** Indicates the hostname */
    name?: string;
    extension?: any;
}
export interface DeviceInformation {
    /** The manufactor of the device */
    manufacturer: string;
    /** The device model */
    model: string;
    /** The firmware version in the device */
    firmwareVersion: string;
    /** The serial number of the device */
    serialNumber: string;
    /** The hardware ID of the device */
    hardwareId: string;
}
export interface Scope {
    /** Indicates if the scope is fixed or configurable */
    scopeDef: 'Fixed' | 'Configurable';
    /** Scope item URI */
    scopeItem: string;
}
export interface MiscCapabilities {
    /** Lists of commands supported by SendAuxiliaryCommand */
    auxiliaryCommands: string[];
}
export interface DeviceServiceCapabilities {
    /** Network capabilities */
    network?: NetworkCapabilities;
    /** Security capabilities */
    security?: SecurityCapabilities;
    /** System capabilities */
    system?: SystemCapabilities;
    /** Capabilities that do not fit in any of the other categories */
    misc?: MiscCapabilities;
    /** The same as misc field */
    auxiliaryCommands?: string[];
}
declare type NetworkHostType = 'IPv4' | 'IPv6' | 'DNS';
declare type IPv4Address = string;
declare type IPv6Address = string;
export interface IPAddress {
    /** Indicates if the address is an IPv4 or IPv6 address */
    type: 'IPv4' | 'IPv6';
    /** IPv4 address */
    IPv4Address?: IPv4Address;
    /** IPv6 address */
    IPv6Address?: IPv6Address;
}
export interface NetworkHost {
    type: NetworkHostType;
    IPv4Address?: IPv4Address;
    IPv6Address?: IPv6Address;
    DNSname?: string;
    extension?: any;
}
export interface NTPInformation {
    fromDHCP: boolean;
    NTPFromDHCP?: NetworkHost[];
    NTPManual?: NetworkHost[];
    extension?: any;
}
export interface DNSInformation {
    fromDHCP: boolean;
    searchDomain?: string[];
    DNSFromDHCP?: IPAddress[];
    DNSManual?: IPAddress[];
    extension?: any;
}
export interface NetworkInterfaceInfo {
    name?: string;
    hwAddress: string;
    MTU?: number;
}
export interface NetworkInterfaceConnectionSetting {
    autoNegotiation: boolean;
    speed: number;
    duplex: 'Full' | 'Half';
}
export interface NetworkInterfaceLink {
    adminSettings: NetworkInterfaceConnectionSetting;
    operSettings: NetworkInterfaceConnectionSetting;
    interfaceType: number;
}
export interface PrefixedIPv4Address {
    address: IPv4Address;
    prefixLength: number;
}
export interface IPv4Configuration {
    manual?: PrefixedIPv4Address[];
    linkLocal?: PrefixedIPv4Address;
    fromDHCP?: PrefixedIPv4Address;
    DHCP: boolean;
}
export interface IPv4NetworkInterface {
    enabled: boolean;
    config?: IPv4Configuration;
}
export interface PrefixedIPv6Address {
    address: IPv6Address;
    prefixLength: number;
}
export interface IPv6Configuration {
    acceptRouterAdvert?: boolean;
    DHCP: 'Auto' | 'Stateful' | 'Stateless' | 'Off';
    manual?: PrefixedIPv6Address[];
    linkLocal?: PrefixedIPv6Address[];
    fromDHCP?: PrefixedIPv6Address[];
    fromRA?: PrefixedIPv6Address[];
    extension?: any;
}
export interface IPv6NetworkInterface {
    enabled: boolean;
    config: IPv6Configuration;
}
export interface Dot11PSKSet {
    key?: number;
    passphrase?: string;
    extension?: any;
}
export interface Dot11SecurityConfiguration {
    mode: 'None' | 'WEP' | 'PSK' | 'Dot1X' | 'Extended';
    algorithm?: 'CCMP' | 'TKIP' | 'Any' | 'Extended';
    PSK?: Dot11PSKSet;
    dot1X?: ReferenceToken;
    extension?: any;
}
export interface Dot11Configuration {
    SSID: number;
    mode: 'Ad-hoc' | 'Infrastructure' | 'Extended';
    alias: string;
    priority: number;
    security: Dot11SecurityConfiguration;
}
export interface NetworkInterfaceExtension {
    interfaceType: number;
    dot3?: any;
    dot11?: Dot11Configuration;
    extension?: any;
}
export interface NetworkInterface {
    token: ReferenceToken;
    enabled: boolean;
    info?: NetworkInterfaceInfo;
    link?: NetworkInterfaceLink;
    IPv4?: IPv4NetworkInterface;
    IPv6?: IPv6NetworkInterface;
    extension?: NetworkInterfaceExtension;
}
/**
 * Device methods
 */
export declare class Device {
    #private;
    private readonly onvif;
    get services(): OnvifService[];
    media2Support: boolean;
    get scopes(): Scope[];
    get serviceCapabilities(): DeviceServiceCapabilities;
    get NTP(): NTPInformation | undefined;
    get DNS(): NTPInformation | undefined;
    get newtworkInterfaces(): NetworkInterface[] | undefined;
    constructor(onvif: Onvif);
    getSystemDateAndTime(): Promise<Date>;
    setSystemDateAndTime(options: SetSystemDateAndTimeOptions): Promise<Date>;
    /**
     * Returns information about services of the device.
     */
    getServices(includeCapability?: boolean): Promise<OnvifService[]>;
    /**
     * This method has been replaced by the more generic {@link Device.getServices | GetServices} method.
     * For capabilities of individual services refer to the GetServiceCapabilities methods.
     */
    getCapabilities(): Promise<Capabilities>;
    /**
     * Receive device information
     */
    getDeviceInformation(): Promise<DeviceInformation>;
    /**
     * Receive hostname information
     */
    getHostname(): Promise<HostnameInformation>;
    /**
     * Receive the scope parameters of a device
     */
    getScopes(): Promise<Scope[]>;
    /**
     * Set the scope parameters of a device
     * @param scopes Array of scope's uris
     */
    setScopes(scopes: string[]): Promise<Scope[]>;
    /**
     * Returns the capabilities of the device service. The result is returned in a typed answer
     */
    getServiceCapabilities(): Promise<DeviceServiceCapabilities>;
    /**
     * This operation reboots the device
     */
    systemReboot(): Promise<string>;
    /**
     * This operation gets the NTP settings from a device. If the device supports NTP, it shall be possible to get the
     * NTP server settings through the GetNTP command.
     */
    getNTP(): Promise<NTPInformation>;
    /**
     * This operation gets the DNS settings from a device. The device shall return its DNS configurations through the
     * GetDNS command.
     */
    getDNS(): Promise<DNSInformation>;
    /**
     * This operation gets the network interface configuration from a device. The device shall support return of network
     * interface configuration settings as defined by the NetworkInterface type through the GetNetworkInterfaces command.
     */
    getNetworkInterfaces(): Promise<NetworkInterface[]>;
}
export {};
