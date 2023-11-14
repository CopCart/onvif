/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { SecureContextOptions } from 'tls';
import { Agent, RequestOptions } from 'https';
import { Capabilities, Device, DeviceInformation } from './device';
import { Media, Profile } from './media';
import { PTZ } from './ptz';
export declare type AnyURI = string;
export declare type ReferenceToken = string;
export declare type Name = string;
/**
 * Cam constructor options
 */
export interface OnvifOptions {
    /** Set true if using `https` protocol, defaults to false. */
    useSecure?: boolean;
    /** Set options for https like ca, cert, ciphers, rejectUnauthorized, secureOptions, secureProtocol, etc. */
    secureOptions?: SecureContextOptions;
    hostname: string;
    username?: string;
    password?: string;
    port?: number;
    path?: string;
    timeout?: number;
    urn?: string;
    /** Supports things like https://www.npmjs.com/package/proxy-agent which provide SOCKS5 and other connections. */
    agent?: Agent | boolean;
    /** Force using hostname and port from constructor for the services (ex.: for proxying), defaults to false. */
    preserveAddress?: boolean;
    /** Set false if the camera should not connect automatically, defaults false. */
    autoConnect?: boolean;
}
export interface OnvifServices {
    PTZ?: URL;
    analyticsDevice?: URL;
    device?: URL;
    deviceIO?: URL;
    display?: URL;
    events?: URL;
    imaging?: URL;
    media2?: URL;
    media?: URL;
    receiver?: URL;
    recording?: URL;
    replay?: URL;
    search?: URL;
}
export interface OnvifRequestOptions extends RequestOptions {
    /** Name of service (ptz, media, etc) */
    service?: keyof OnvifServices;
    /** SOAP body */
    body: string;
    /** Defines another url to request */
    url?: string;
    /** Make request to PTZ uri or not */
    ptz?: boolean;
}
/**
 * Information about active video source
 */
export interface ActiveSource {
    sourceToken: string;
    profileToken: string;
    videoSourceConfigurationToken: string;
    encoding?: string;
    width?: number;
    height?: number;
    fps?: number;
    bitrate?: number;
    ptz?: {
        name: string;
        token: string;
    };
}
export interface SetSystemDateAndTimeOptions {
    dateTime?: Date;
    dateTimeType: 'Manual' | 'NTP';
    daylightSavings?: boolean;
    timezone?: string;
}
export declare class Onvif extends EventEmitter {
    /**
     * Indicates raw xml request to device.
     * @event rawRequest
     * @example
     * ```typescript
     * onvif.on('rawRequest', (xml) => { console.log('-> request was', xml); });
     * ```
     */
    static rawRequest: 'rawRequest';
    /**
     * Indicates raw xml response from device.
     * @event rawResponse
     * @example
     * ```typescript
     * onvif.on('rawResponse', (xml) => { console.log('<- response was', xml); });
     * ```
     */
    static rawResponse: 'rawResponse';
    /**
     * Indicates any warnings
     * @event warn
     * @example
     * ```typescript
     * onvif.on('warn', console.warn);
     * ```
     */
    static warn: 'warn';
    /**
     * Indicates any errors
     * @param error Error object
     * @event error
     * @example
     * ```typescript
     * onvif.on('error', console.error);
     * ```
     */
    static error: 'error';
    /**
     * Core device namespace for device v1.0 methods
     * @example
     * ```typescript
     * const date = await onvif.device.getSystemDateAndTime();
     * console.log(date.toLocaleString());
     * ```
     */
    readonly device: Device;
    readonly media: Media;
    readonly ptz: PTZ;
    useSecure: boolean;
    secureOptions: SecureContextOptions;
    hostname: string;
    username?: string;
    password?: string;
    port: number;
    path: string;
    timeout: number;
    agent: Agent | boolean;
    preserveAddress: boolean;
    private events;
    uri: OnvifServices;
    private timeShift?;
    capabilities: Capabilities;
    defaultProfiles: Profile[];
    defaultProfile?: Profile;
    private activeSources;
    activeSource?: ActiveSource;
    readonly urn?: string;
    deviceInformation?: DeviceInformation;
    constructor(options: OnvifOptions);
    /**
     * Envelope header for all SOAP messages
     * @param openHeader
     * @private
     */
    private envelopeHeader;
    /**
     * Envelope footer for all SOAP messages
     * @private
     */
    private envelopeFooter;
    private passwordDigest;
    private setupSystemDateAndTime;
    private rawRequest;
    request(options: OnvifRequestOptions): Promise<[Record<string, any>, string]>;
    /**
     * Parse url with an eye on `preserveAddress` property
     * @param address
     * @private
     */
    parseUrl(address: string): URL;
    /**
     * Receive date and time from cam
     */
    getSystemDateAndTime(): Promise<Date>;
    /**
     * Set the device system date and time
     */
    setSystemDateAndTime(options: SetSystemDateAndTimeOptions): Promise<Date>;
    /**
     * Check and find out video configuration for device
     * @private
     */
    private getActiveSources;
    /**
     * Connect to the camera and fill device information properties
     */
    connect(): Promise<this>;
}
