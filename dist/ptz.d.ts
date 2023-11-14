import { Onvif, ReferenceToken } from './onvif';
import { Duration, PTZConfiguration, PTZSpeed, Space1DDescription, Space2DDescription, Vector1D, Vector2D } from './media';
export interface PTZPresetTourSupported {
    /** Indicates number of preset tours that can be created. Required preset tour operations shall be available for this
     * PTZ Node if one or more preset tour is supported */
    maximumNumberOfPresetTours: number;
    /** Indicates which preset tour operations are available for this PTZ Node */
    ptzPresetTourOperation: 'Start' | 'Stop' | 'Pause' | 'Extended';
}
export interface PTZNode {
    /** Unique identifier referencing the physical entity */
    token: ReferenceToken;
    /** Indication whether the HomePosition of a Node is fixed or it can be changed via the SetHomePosition command */
    fixedHomePosition: boolean;
    /** Indication whether the Node supports the geo-referenced move command */
    geoMove: boolean;
    /** A unique identifier that is used to reference PTZ Nodes */
    name?: string;
    /** A list of Coordinate Systems available for the PTZ Node. For each Coordinate System, the PTZ Node MUST specify
     * its allowed range */
    supportedPTZSpaces: PTZSpace[];
    /** All preset operations MUST be available for this PTZ Node if one preset is supported */
    maximumNumberOfPresets: number;
    /** A boolean operator specifying the availability of a home position. If set to true, the Home Position Operations
     * MUST be available for this PTZ Node */
    homeSupported: boolean;
    /** A list of supported Auxiliary commands. If the list is not empty, the Auxiliary Operations MUST be available for
     * this PTZ Node */
    auxiliaryCommands?: any;
    extension?: {
        /** Detail of supported Preset Tour feature */
        supportedPresetTour?: PTZPresetTourSupported;
        extension?: any;
    };
}
export interface PTZSpace {
    /**  The Generic Pan/Tilt Position space is provided by every PTZ node that supports absolute Pan/Tilt, since it
     * does not relate to a specific physical range. Instead, the range should be defined as the full range of the PTZ
     * unit normalized to the range -1 to 1 resulting in the following space description */
    absolutePanTiltPositionSpace?: Space2DDescription;
    /**  The Generic Zoom Position Space is provided by every PTZ node that supports absolute Zoom, since it does not
     * relate to a specific physical range. Instead, the range should be defined as the full range of the Zoom normalized
     * to the range 0 (wide) to 1 (tele). There is no assumption about how the generic zoom range is mapped
     * to magnification, FOV or other physical zoom dimension */
    absoluteZoomPositionSpace?: Space1DDescription;
    /** The Generic Pan/Tilt translation space is provided by every PTZ node that supports relative Pan/Tilt, since it
     * does not relate to a specific physical range. Instead, the range should be defined as the full positive and
     * negative translation range of the PTZ unit normalized to the range -1 to 1, where positive translation would mean
     * clockwise rotation or movement in right/up direction resulting in the following space description */
    relativePanTiltTranslationSpace?: Space2DDescription;
    /** The Generic Zoom Translation Space is provided by every PTZ node that supports relative Zoom, since it does not
     * relate to a specific physical range. Instead, the corresponding absolute range should be defined as the full
     * positive and negative translation range of the Zoom normalized to the range -1 to1, where a positive translation
     * maps to a movement in TELE direction. The translation is signed to indicate direction (negative is to wide,
     * positive is to tele). There is no assumption about how the generic zoom range is mapped to magnification, FOV or
     * other physical zoom dimension. This results in the following space description */
    relativeZoomTranslationSpace?: Space1DDescription;
    /** The generic Pan/Tilt velocity space shall be provided by every PTZ node, since it does not relate to a specific
     * physical range. Instead, the range should be defined as a range of the PTZ unit’s speed normalized to the range
     * -1 to 1, where a positive velocity would map to clockwise rotation or movement in the right/up direction. A signed
     * speed can be independently specified for the pan and tilt component resulting in the following space description */
    continuousPanTiltVelocitySpace?: Space2DDescription;
    /** The generic zoom velocity space specifies a zoom factor velocity without knowing the underlying physical model.
     * The range should be normalized from -1 to 1, where a positive velocity would map to TELE direction. A generic zoom
     * velocity space description resembles the following */
    continuousZoomVelocitySpace?: Space1DDescription;
    /** The speed space specifies the speed for a Pan/Tilt movement when moving to an absolute position or to a relative
     * translation. In contrast to the velocity spaces, speed spaces do not contain any directional information. The speed
     * of a combined Pan/Tilt movement is represented by a single non-negative scalar value */
    panTiltSpeedSpace?: Space1DDescription;
    /** The speed space specifies the speed for a Zoom movement when moving to an absolute position or to a relative
     * translation. In contrast to the velocity spaces, speed spaces do not contain any directional information */
    zoomSpeedSpace?: Space1DDescription;
    extension?: any;
}
export interface DurationRange {
    min: Duration;
    max: Duration;
}
export interface PTControlDirectionOptions {
    /** Supported options for EFlip feature */
    EFlip?: {
        /** Options of EFlip mode parameter */
        mode?: 'OFF' | 'ON' | 'Extended';
        extension?: any;
    };
    /** Supported options for Reverse feature */
    reverse?: {
        /** Options of Reverse mode parameter */
        mode?: 'OFF' | 'ON' | 'AUTO' | 'Extended';
        extension?: any;
    };
}
/** The requested PTZ configuration options */
export interface PTZConfigurationOptions {
    /** The list of acceleration ramps supported by the device. The smallest acceleration value corresponds to the minimal
     * index, the highest acceleration corresponds to the maximum index */
    PTZRamps: number[];
    /** A list of supported coordinate systems including their range limitations */
    spaces: PTZSpace[];
    /** A timeout Range within which Timeouts are accepted by the PTZ Node */
    PTZTimeout: DurationRange;
    /** Supported options for PT Direction Control */
    PTControlDirection?: PTControlDirectionOptions;
    extension: any;
}
export interface GetPresetsOptions {
    profileToken?: ReferenceToken;
}
/** A list of presets which are available for the requested MediaProfile. */
export interface PTZPreset {
    token: ReferenceToken;
    /** A list of preset position name */
    name?: string;
    /** A list of preset position */
    PTZPosition?: PTZVector;
}
export interface PTZVector {
    panTilt?: Vector2D;
    zoom?: Vector1D;
}
/**
 * Simplified structure of PTZ vector to use as an input argument for position and speed in movement commands.
 * */
export interface PTZInputVector {
    /** Pan value */
    pan?: number;
    /** Synonym for pan value */
    x?: number;
    /** Tilt value */
    tilt?: number;
    /** Synonym for tilt value */
    y?: number;
    /** Zoom value */
    zoom?: number;
}
export interface GotoPresetOptions {
    /** A reference to the MediaProfile where the operation should take place. */
    profileToken?: ReferenceToken;
    /** A requested preset token. From {@link PTZ.presets} property */
    presetToken: ReferenceToken;
    /** A requested speed.The speed parameter can only be specified when Speed Spaces are available for the PTZ Node. */
    speed?: PTZVector | PTZInputVector;
}
export interface SetPresetOptions {
    /** A reference to the MediaProfile where the operation should take place. */
    profileToken?: ReferenceToken;
    /** A requested preset name. */
    presetName: string;
    /** A requested preset token. */
    presetToken?: ReferenceToken;
}
export interface SetPresetResponse {
    /** A token to the Preset which has been set. */
    presetToken: ReferenceToken;
}
export interface RemovePresetOptions {
    /** A reference to the MediaProfile where the operation should take place. */
    profileToken?: ReferenceToken;
    /** A requested preset token. */
    presetToken: ReferenceToken;
}
export interface GotoHomePositionOptions {
    /** A reference to the MediaProfile where the operation should take place. */
    profileToken?: ReferenceToken;
    /** A requested speed.The speed parameter can only be specified when Speed Spaces are available for the PTZ Node. */
    speed?: PTZVector | PTZInputVector;
}
export interface SetHomePositionOptions {
    /** A reference to the MediaProfile where the home position should be set. */
    profileToken?: ReferenceToken;
}
export interface GetStatusOptions {
    profileToken?: ReferenceToken;
}
declare type MoveStatus = string;
export interface PTZMoveStatus {
    panTilt: MoveStatus;
    zoom: MoveStatus;
}
export interface PTZStatus {
    /** Specifies the absolute position of the PTZ unit together with the Space references. The default absolute spaces
     * of the corresponding PTZ configuration MUST be referenced within the Position element. */
    position?: PTZVector;
    /** Indicates if the Pan/Tilt/Zoom device unit is currently moving, idle or in an unknown state. */
    moveStatus?: PTZMoveStatus;
    /** States a current PTZ error. */
    error?: string;
    /** Specifies the UTC time when this status was generated. */
    utcTime?: Date;
}
export interface AbsoluteMoveOptions {
    /** A reference to the MediaProfile. */
    profileToken?: ReferenceToken;
    /** A Position vector specifying the absolute target position. */
    position: PTZVector;
    /** An optional Speed. */
    speed?: PTZSpeed;
}
export interface RelativeMoveOptions {
    /** A reference to the MediaProfile. */
    profileToken?: ReferenceToken;
    /** A positional Translation relative to the current position */
    translation: PTZVector;
    /** An optional Speed. */
    speed?: PTZSpeed;
}
export interface ContinuousMoveOptions {
    /** A reference to the MediaProfile. */
    profileToken?: ReferenceToken;
    /** A Velocity vector specifying the velocity of pan, tilt and zoom. */
    velocity: PTZSpeed;
    /** An optional Timeout parameter. Milliseconds or duration string. */
    timeout?: Duration | number;
}
export interface StopOptions {
    /** A reference to the MediaProfile that indicate what should be stopped. */
    profileToken?: ReferenceToken;
    /** Set true when we want to stop ongoing pan and tilt movements.If PanTilt arguments are not present, this command
     * stops these movements. */
    panTilt?: boolean;
    /** Set true when we want to stop ongoing zoom movement.If Zoom arguments are not present, this command stops ongoing
     * zoom movement. */
    zoom?: boolean;
}
/**
 * PTZ methods
 */
export declare class PTZ {
    #private;
    private readonly onvif;
    get nodes(): Record<string, PTZNode>;
    get configurations(): Record<string, PTZConfiguration>;
    get presets(): Record<string, PTZPreset>;
    constructor(onvif: Onvif);
    /**
    * Returns the properties of the requested PTZ node, if it exists.
    * Use this function to get maximum number of presets, ranges of admitted values for x, y, zoom, iris, focus
    */
    getNodes(): Promise<Record<string, PTZNode>>;
    /**
     * Get an array with all the existing PTZConfigurations from the device
     */
    getConfigurations(): Promise<Record<string, PTZConfiguration>>;
    /**
     * List supported coordinate systems including their range limitations.
     * Therefore, the options MAY differ depending on whether the PTZ Configuration is assigned to a Profile containing
     * a Video Source Configuration. In that case, the options may additionally contain coordinate systems referring to
     * the image coordinate system described by the Video Source Configuration. If the PTZ Node supports continuous
     * movements, it shall return a Timeout Range within which Timeouts are accepted by the PTZ Node
     * @param options
     * @param options.configurationToken Token of an existing configuration that the options are intended for
     */
    getConfigurationOptions({ configurationToken }: {
        configurationToken: ReferenceToken;
    }): Promise<PTZConfigurationOptions>;
    /**
     * Operation to request all PTZ presets for the PTZNode in the selected profile. The operation is supported if there
     * is support for at least on PTZ preset by the PTZNode.
     * @param options
     */
    getPresets({ profileToken }?: GetPresetsOptions): Promise<Record<string, PTZPreset>>;
    private static formatPTZSimpleVector;
    private static PTZVectorToXML;
    /**
     * Operation to go to a saved preset position for the PTZNode in the selected profile. The operation is supported if
     * there is support for at least on PTZ preset by the PTZNode.
     * @param options
     */
    gotoPreset({ profileToken, presetToken, speed }: GotoPresetOptions): Promise<void>;
    /**
     * The SetPreset command saves the current device position parameters so that the device can move to the saved preset
     * position through the GotoPreset operation. In order to create a new preset, the SetPresetRequest contains no
     * PresetToken. If creation is successful, the Response contains the PresetToken which uniquely identifies the Preset.
     * An existing Preset can be overwritten by specifying the PresetToken of the corresponding Preset. In both cases
     * (overwriting or creation) an optional PresetName can be specified. The operation fails if the PTZ device is moving
     * during the SetPreset operation. The device MAY internally save additional states such as imaging properties in the
     * PTZ Preset which then should be recalled in the GotoPreset operation.
     * @param options
     */
    setPreset({ profileToken, presetName, presetToken }: SetPresetOptions): Promise<SetPresetResponse>;
    /**
     * Operation to remove a PTZ preset for the Node in the selected profile. The operation is supported if the
     * PresetPosition capability exists for teh Node in the selected profile.
     * @param options
     */
    removePreset({ profileToken, presetToken }: RemovePresetOptions): Promise<void>;
    /**
     * Operation to move the PTZ device to it's "home" position. The operation is supported if the HomeSupported element
     * in the PTZNode is true.
     * @param options
     */
    gotoHomePosition({ profileToken, speed }: GotoHomePositionOptions): Promise<void>;
    /**
     * Operation to save current position as the home position. The SetHomePosition command returns with a failure if
     * the “home” position is fixed and cannot be overwritten. If the SetHomePosition is successful, it is possible
     * to recall the Home Position with the GotoHomePosition command.
     * @param options
     */
    setHomePosition({ profileToken }: SetHomePositionOptions): Promise<void>;
    /**
     * Operation to request PTZ status for the Node in the selected profile.
     * @param options
     */
    getStatus({ profileToken }?: GetStatusOptions): Promise<PTZStatus>;
    /**
     * Operation to move pan,tilt or zoom to a absolute destination.
     *
     * The speed argument is optional. If an x/y speed value is given it is up to the device to either use the x value as
     * absolute resoluting speed vector or to map x and y to the component speed. If the speed argument is omitted, the
     * default speed set by the PTZConfiguration will be used.
     * @param options
     */
    absoluteMove({ profileToken, position, speed, }: AbsoluteMoveOptions): Promise<void>;
    /**
     * Operation for Relative Pan/Tilt and Zoom Move. The operation is supported if the PTZNode supports at least one
     * relative Pan/Tilt or Zoom space.
     *
     * The speed argument is optional. If an x/y speed value is given it is up to the device to either use the x value as
     * absolute resoluting speed vector or to map x and y to the component speed. If the speed argument is omitted,
     * the default speed set by the PTZConfiguration will be used.
     * @param options
     */
    relativeMove({ profileToken, translation, speed, }: RelativeMoveOptions): Promise<void>;
    /**
     * Operation for continuous Pan/Tilt and Zoom movements. The operation is supported if the PTZNode supports at least
     * one continuous Pan/Tilt or Zoom space. If the space argument is omitted, the default space set by the
     * PTZConfiguration will be used.
     * @param options
     */
    continuousMove({ profileToken, velocity, timeout, }: ContinuousMoveOptions): Promise<void>;
    /**
     * Operation to stop ongoing pan, tilt and zoom movements of absolute relative and continuous type. If no stop
     * argument for pan, tilt or zoom is set, the device will stop all ongoing pan, tilt and zoom movements.
     * @param options
     */
    stop(options?: StopOptions): Promise<void>;
}
export {};
