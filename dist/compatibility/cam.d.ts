/**
 * Module to provide backward compatibility with versions 0.x
 */
/// <reference types="node" />
import { EventEmitter } from 'events';
import { OnvifRequestOptions, ReferenceToken, SetSystemDateAndTimeOptions } from '../onvif';
import { GetSnapshotUriOptions, GetStreamUriOptions } from '../media';
import { GetPresetsOptions, GetStatusOptions, GotoHomePositionOptions, GotoPresetOptions, AbsoluteMoveOptions, RemovePresetOptions, SetHomePositionOptions, SetPresetOptions, RelativeMoveOptions, ContinuousMoveOptions } from '../ptz';
export declare type Callback = (error: any, result?: any) => void;
export declare type CompatibilityAbsoluteMoveOptions = AbsoluteMoveOptions & {
    x?: number;
    y?: number;
    zoom?: number;
};
export declare type CompatibilityRelativeMoveOptions = RelativeMoveOptions & {
    x?: number;
    y?: number;
    zoom?: number;
};
interface CompatibilityContinuousMoveOptions extends ContinuousMoveOptions {
    x?: number;
    y?: number;
    zoom?: number;
    onlySendPanTilt?: boolean;
    onlySendZoom?: boolean;
}
export declare class Cam extends EventEmitter {
    private onvif;
    constructor(options: any, callback: Callback);
    get port(): number;
    get path(): string;
    set hostname(name: string);
    set timeout(time: number);
    get timeout(): number;
    get services(): import("..").OnvifService[];
    get capabilities(): import("..").Capabilities;
    get uri(): import("../onvif").OnvifServices;
    get videoSources(): import("../media").VideoSource[];
    get profiles(): import("../media").Profile[];
    get defaultProfile(): import("../media").Profile | undefined;
    get defaultProfiles(): import("../media").Profile[];
    get activeSource(): import("../onvif").ActiveSource | undefined;
    get serviceCapabilities(): import("..").DeviceServiceCapabilities;
    get deviceInformation(): import("..").DeviceInformation | undefined;
    get nodes(): Record<string, import("../ptz").PTZNode>;
    get configurations(): Record<string, import("../media").PTZConfiguration>;
    get presets(): any;
    connect(callback: Callback): void;
    _request(options: OnvifRequestOptions, callback: Callback): void;
    getSystemDateAndTime(callback: Callback): void;
    setSystemDateAndTime(value: SetSystemDateAndTimeOptions, callback: Callback): void;
    getHostname(callback: Callback): void;
    getScopes(callback: Callback): void;
    setScopes(value: string[], callback: Callback): void;
    getCapabilities(callback: Callback): void;
    getServiceCapabilities(callback: Callback): void;
    getActiveSources(callback: Callback): void;
    getVideoSources(callback: Callback): void;
    getServices(includeCapability: boolean, callback: Callback): void;
    getDeviceInformation(callback: Callback): void;
    getStreamUri(options: GetStreamUriOptions, callback: Callback): void;
    getStreamUri(callback: Callback): void;
    getSnapshotUri(options: GetSnapshotUriOptions, callback: Callback): void;
    getSnapshotUri(callback: Callback): void;
    getNodes(callback: Callback): void;
    getConfigurations(callback: Callback): void;
    getConfigurationOptions(configurationToken: ReferenceToken, callback: Callback): void;
    systemReboot(callback: Callback): void;
    getPresets(options: GetPresetsOptions, callback: Callback): void;
    getPresets(callback: Callback): void;
    gotoPreset(options: GotoPresetOptions, callback: Callback): void;
    setPreset(options: SetPresetOptions, callback: Callback): void;
    removePreset(options: RemovePresetOptions, callback: Callback): void;
    gotoHomePosition(options: GotoHomePositionOptions, callback: Callback): void;
    setHomePosition(options: SetHomePositionOptions, callback: Callback): void;
    getStatus(options: GetStatusOptions, callback: Callback): void;
    getStatus(callback: Callback): void;
    absoluteMove(compatibilityOptions: CompatibilityAbsoluteMoveOptions, callback?: Callback): void;
    relativeMove(compatibilityOptions: CompatibilityRelativeMoveOptions, callback?: Callback): void;
    continuousMove(compatibilityOptions: CompatibilityContinuousMoveOptions, callback?: Callback): void;
    stop(): void;
    stop(options: GetStatusOptions, callback: Callback): void;
    stop(callback: Callback): void;
    getNTP(callback: Callback): void;
    getDNS(callback: Callback): void;
    getNetworkInterfaces(callback: Callback): void;
}
export {};
