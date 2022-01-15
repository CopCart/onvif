import { isNumber } from 'util';
import { Onvif } from './onvif';
import { linerase } from './utils';

export interface IntRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Rotate {
  /** Parameter to enable/disable Rotation feature */
  mode: 'OFF' | 'ON' | 'AUTO';
  /** Optional parameter to configure how much degree of clockwise rotation of image for On mode. Omitting this parameter for On mode means 180 degree rotation. */
  degree?: number;
  extension: any;
}

export interface LensOffset {
  /** Optional horizontal offset of the lens center in normalized coordinates */
  x: number;
  /** Optional vertical offset of the lens center in normalized coordinates */
  y: number;
}

export interface LensProjection {
  /** Angle of incidence */
  angle: number;
  /** Mapping radius as a consequence of the emergent angle */
  radius: number;
  /** Optional ray absorption at the given angle due to vignetting. A value of one means no absorption */
  transmittance?: number;
}

export interface LensDescription {
  /** Optional focal length of the optical system */
  focalLength: number;
  /** Offset of the lens center to the imager center in normalized coordinates */
  offset: LensOffset;
  /**
   * Radial description of the projection characteristics.
   * The resulting curve is defined by the B-Spline interpolation over the given elements.
   * The element for Radius zero shall not be provided. The projection points shall be ordered with ascending Radius.
   * Items outside the last projection Radius shall be assumed to be invisible (black)
   */
  projection: LensProjection;
  /** Compensation of the x coordinate needed for the ONVIF normalized coordinate system */
  XFactor: number;
}

export interface SceneOrientation {
  /** Parameter to assign the way the camera determines the scene orientation */
  mode: 'MANUAL' | 'AUTO';
  /**
   * Assigned or determined scene orientation based on the Mode.
   * When assigning the Mode to AUTO, this field is optional and will be ignored by the device.
   * When assigning the Mode to MANUAL, this field is required and the device will return an InvalidArgs fault if missing
   */
  orientation?: string;
}

export interface VideoSourceConfigurationExtension2 {
  /** Optional element describing the geometric lens distortion. Multiple instances for future variable lens support */
  lensDescription?: LensDescription;
  /** Optional element describing the scene orientation in the camera’s field of view */
  sceneOrientation: SceneOrientation;
}

export interface VideoSourceConfigurationExtension {
  /**
   * Optional element to configure rotation of captured image. What resolutions a device supports shall be unaffected by the Rotate parameters.
   * If a device is configured with Rotate=AUTO, the device shall take control over the Degree parameter and automatically update it so that a client can query current rotation.
   * The device shall automatically apply the same rotation to its pan/tilt control direction depending on the following condition:
   * if Reverse=AUTO in PTControlDirection or if the device doesn’t support Reverse in PTControlDirection
   */
  rotate: Rotate;
  extension?: VideoSourceConfigurationExtension2;
}

export interface VideoSourceConfiguration {
  /** Token that uniquely references this configuration. Length up to 64 characters */
  token: string;
  /** User readable name. Length up to 64 characters */
  name: string;
  /**
   * Number of internal references currently using this configuration
   * This informational parameter is read-only. Deprecated for Media2 Service
   * */
  useCount: number;
  /** Readonly parameter signalling Source configuration's view mode, for devices supporting different view modes as defined in tt:viewModes */
  viewMode: string;
  /** Reference to the physical input */
  sourceToken: string;
  /** Rectangle specifying the Video capturing area. The capturing area shall not be larger than the whole Video source area */
  bounds: IntRectangle;
  extension?: VideoSourceConfigurationExtension;
}

export interface AudioSourceConfiguration {
  /** Token that uniquely references this configuration. Length up to 64 characters */
  token: string;
  /** User readable name. Length up to 64 characters */
  name: string;
  /**
   * Number of internal references currently using this configuration
   * This informational parameter is read-only. Deprecated for Media2 Service
   */
  useCount: number;
  /** Token of the Audio Source the configuration applies to */
  sourceToken: string;
}

export interface VideoResolution {
  /** Number of the columns of the Video image */
  width: number;
  /** Number of the lines of the Video image */
  height: number;
}

export interface VideoRateControl {
  /** Maximum output framerate in fps. If an EncodingInterval is provided the resulting encoded framerate will be reduced by the given factor */
  frameRateLimit: number;
  /** Interval at which images are encoded and transmitted. (A value of 1 means that every frame is encoded, a value of 2 means that every 2nd frame is encoded ...) */
  encodingInterval: number;
  /** the maximum output bitrate in kbps */
  bitrateLimit: number;
}

export interface Mpeg4Configuration {
  /**
   * Determines the interval in which the I-Frames will be coded. An entry of 1 indicates I-Frames are continuously generated.
   * An entry of 2 indicates that every 2nd image is an I-Frame, and 3 only every 3rd frame, etc.
   * The frames in between are coded as P or B Frames
   */
  govLength: number;
  /** The Mpeg4 profile, either simple profile (SP) or advanced simple profile (ASP) */
  mpeg4Profile: 'SP' | 'ASP';
}

export interface H264Configuration {
  /**
   * Group of Video frames length. Determines typically the interval in which the I-Frames will be coded.
   * An entry of 1 indicates I-Frames are continuously generated.
   * An entry of 2 indicates that every 2nd image is an I-Frame, and 3 only every 3rd frame, etc.
   * The frames in between are coded as P or B Frames
   */
  govLength: number;
  /** The H.264 profile, either baseline, main, extended or high */
  H264Profile: 'Baseline' | 'Main' | 'Extended' | 'High';
}

export interface IPAddress {
  /** Indicates if the address is an IPv4 or IPv6 address */
  type: 'IPv4' | 'IPv6';
  /** IPv4 address */
  IPv4Address?: string;
  /** IPv6 address */
  IPv6Address?: string;
}

export interface MulticastConfiguration {
  /** The multicast address (if this address is set to 0 no multicast streaming is enaled) */
  address: IPAddress;
  /**
   * The RTP mutlicast destination port. A device may support RTCP.
   * In this case the port value shall be even to allow the corresponding RTCP stream to be mapped to the next higher (odd)
   * destination port number as defined in the RTSP specification
   */
  port: number;
  /**
   * In case of IPv6 the TTL value is assumed as the hop limit.
   * Note that for IPV6 and administratively scoped IPv4 multicast the primary use for hop limit / TTL is to prevent packets
   * from (endlessly) circulating and not limiting scope. In these cases the address contains the scope
   */
  TTL: number;
  /**
   * Read only property signalling that streaming is persistant.
   * Use the methods StartMulticastStreaming and StopMulticastStreaming to switch its state.
   */
  autoStart: boolean;
}

export type Duration = string;

export interface VideoEncoderConfiguration {
  /** Token that uniquely references this configuration. Length up to 64 characters */
  token: string;
  /** User readable name. Length up to 64 characters */
  name: string;
  /**
   * Number of internal references currently using this configuration.
   * This informational parameter is read-only. Deprecated for Media2 Service.
   */
  useCount: number;
  /**
   * A value of true indicates that frame rate is a fixed value rather than an upper limit,
   * and that the video encoder shall prioritize frame rate over all other adaptable configuration values such as bitrate.
   * Default is false.
   */
  guaranteedFrameRate: boolean;
  /** Used video codec, either Jpeg, H.264 or Mpeg4 */
  encoding: 'JPEG' | 'MPEG4' | 'H264';
  /** Configured video resolution */
  resolution: VideoResolution;
  /**
   * Relative value for the video quantizers and the quality of the video.
   * A high value within supported quality range means higher quality
   */
  quality: number;
  /** Optional element to configure rate control related parameters. */
  rateControl?: VideoRateControl;
  /** Optional element to configure Mpeg4 related parameters */
  MPEG4?: Mpeg4Configuration;
  /** Optional element to configure H.264 related parameters. */
  H264: H264Configuration;
  /** Defines the multicast settings that could be used for video streaming */
  multicast: MulticastConfiguration;
  /** The rtsp session timeout for the related video stream */
  sessionTimeout: Duration;
}

export interface AudioEncoderConfiguration {
  /** Token that uniquely references this configuration. Length up to 64 characters */
  token: string;
  /** User readable name. Length up to 64 characters */
  name: string;
  /**
   * Number of internal references currently using this configuration.
   * This informational parameter is read-only. Deprecated for Media2 Service.
   */
  useCount: number;
  /** Audio codec used for encoding the audio input (either G.711, G.726 or AAC) */
  encoding: 'G711' | 'G726' | 'AAC';
  /** The output bitrate in kbps */
  bitrate: number;
  /** The output sample rate in kHz */
  sampleRate: number;
  /** Defines the multicast settings that could be used for video streaming */
  multicast: MulticastConfiguration;
  /** The rtsp session timeout for the related audio stream */
  sessionTimeout: Duration;
}

export interface ItemList {
  /** Value name pair as defined by the corresponding description */
  simpleItem?: {
    /** Item name */
    name: string;
    /** Item value. The type is defined in the corresponding description */
    value: any;
  }
  /** Complex value structure */
  elementItem?: any;
  extension: any;
}

export interface Config {
  /** Name of the configuration */
  name: string;
  /**
   * The Type attribute specifies the type of rule and shall be equal to value of one of Name attributes of ConfigDescription elements
   * returned by GetSupportedRules and GetSupportedAnalyticsModules command.
   */
  type: string;
  /** List of configuration parameters as defined in the corresponding description */
  parameters: ItemList[];
}

export interface AnalyticsEngineConfiguration {
  analyticsModule?: Config;
  extension?: any;
}

export interface RuleEngineConfiguration {
  rule?: Config;
  extension?: any;
}

export interface VideoAnalyticsConfiguration {
  /** Token that uniquely references this configuration. Length up to 64 characters */
  token: string;
  /** User readable name. Length up to 64 characters */
  name: string;
  /**
   * Number of internal references currently using this configuration.
   * This informational parameter is read-only. Deprecated for Media2 Service.
   */
  useCount: number;
  analyticsEngineConfiguration: AnalyticsEngineConfiguration;
  ruleEngineConfiguration: RuleEngineConfiguration;
}

export interface PTZSpeed {
  /**
   * Pan and tilt speed. The x component corresponds to pan and the y component to tilt.
   * If omitted in a request, the current (if any) PanTilt movement should not be affected
   */
  panTilt: {
    x: number;
    y: number;
  };
  /** A zoom speed. If omitted in a request, the current (if any) Zoom movement should not be affected */
  zoom: {
    x: number;
  }
}

export interface Range {
  min: number;
  max: number;
}

export interface Space2DDescription {
  /** A URI of coordinate systems */
  URI: string;
  /** A range of x-axis */
  XRange: Range;
  /** A range of y-axis */
  YRange: Range;
}

export interface PanTiltLimits {
  /** A range of pan tilt limits */
  range: Space2DDescription;
}

export interface Space1DDescription {
  /** A URI of coordinate systems */
  URI: string;
  /** A range of x-axis */
  XRange: Range;
}

export interface ZoomLimits {
  range: Space1DDescription;
}

export interface PTControlDirection {
  /** Optional element to configure related parameters for E-Flip */
  EFlip?: {
    /** Parameter to enable/disable E-Flip feature */
    mode: 'OFF' | 'ON' | 'Extended';
  };
  /** Optional element to configure related parameters for reversing of PT Control Direction */
  reverse: {
    /** Parameter to enable/disable Reverse feature */
    mode: 'OFF' | 'ON' | 'AUTO' | 'Extended';
  };
  extension: any;
}

export interface PTZConfigurationExtension {
  /** Optional element to configure PT Control Direction related features */
  PTControlDirection: PTControlDirection;
  extension: any;
}

export interface PTZConfiguration {
  /** Token that uniquely references this configuration. Length up to 64 characters */
  token: string;
  /** User readable name. Length up to 64 characters */
  name: string;
  /**
   * Number of internal references currently using this configuration.
   * This informational parameter is read-only. Deprecated for Media2 Service.
   */
  useCount: number;
  /** The optional acceleration ramp used by the device when moving */
  moveRamp: number;
  /** The optional acceleration ramp used by the device when recalling presets */
  presetRamp: number;
  /** The optional acceleration ramp used by the device when executing PresetTours */
  presetTourRamp: number;
  /** A mandatory reference to the PTZ Node that the PTZ Configuration belongs to */
  nodeToken: string;
  /** If the PTZ Node supports absolute Pan/Tilt movements, it shall specify one Absolute Pan/Tilt Position Space as default */
  defaultAbsolutePantTiltPositionSpace?: string;
  /** If the PTZ Node supports absolute zoom movements, it shall specify one Absolute Zoom Position Space as default */
  defaultAbsoluteZoomPositionSpace?: string;
  /** If the PTZ Node supports relative Pan/Tilt movements, it shall specify one RelativePan/Tilt Translation Space as default */
  defaultRelativePanTiltTranslationSpace?: string;
  /** If the PTZ Node supports relative zoom movements, it shall specify one Relative Zoom Translation Space as default */
  defaultRelativeZoomTranslationSpace?: string
  /** If the PTZ Node supports continuous Pan/Tilt movements, it shall specify one Continuous Pan/Tilt Velocity Space as default */
  defaultContinuousPanTiltVelocitySpace?: string;
  /** If the PTZ Node supports continuous zoom movements, it shall specify one Continuous Zoom Velocity Space as default */
  defaultContinuousZoomVelocitySpace?: string;
  /** If the PTZ Node supports absolute or relative PTZ movements, it shall specify corresponding default Pan/Tilt and Zoom speeds */
  defaultPTZSpeed?: PTZSpeed;
  /** If the PTZ Node supports continuous movements, it shall specify a default timeout, after which the movement stops */
  defaultPTZTimeout?: Duration;
  /**
   * The Pan/Tilt limits element should be present for a PTZ Node that supports an absolute Pan/Tilt.
   * If the element is present it signals the support for configurable Pan/Tilt limits.
   * If limits are enabled, the Pan/Tilt movements shall always stay within the specified range.
   * The Pan/Tilt limits are disabled by setting the limits to –INF or +INF
   */
  panTiltLimits?: PanTiltLimits;
  /**
   * The Zoom limits element should be present for a PTZ Node that supports absolute zoom.
   * If the element is present it signals the supports for configurable Zoom limits.
   * If limits are enabled the zoom movements shall always stay within the specified range.
   * The Zoom limits are disabled by settings the limits to -INF and +INF
   */
  zoomLimits?: ZoomLimits;
  extension?: PTZConfigurationExtension;
}

export interface Profile {
  /** Unique identifier of the profile */
  token: string;
  /** A value of true signals that the profile cannot be deleted. Default is false */
  fixed: boolean;
  /** User readable name of the profile */
  name: string;
  /** Optional configuration of the Video input */
  videoSourceConfiguration?: VideoSourceConfiguration;
  /** Optional configuration of the Audio input */
  audioSourceConfiguration?: AudioSourceConfiguration;
  /** Optional configuration of the Video encoder */
  videoEncoderConfiguration?: VideoEncoderConfiguration;
  /** Optional configuration of the Audio encoder */
  audioEncoderConfiguration?: AudioEncoderConfiguration;
  /** Optional configuration of the video analytics module and rule engine */
  videoAnalyticsConfiguration?: VideoAnalyticsConfiguration;
  /** Optional configuration of the pan tilt zoom unit */
  PTZConfiguration?: PTZConfiguration;

//     PTZConfiguration - optional; [PTZConfiguration]
//     Optional configuration of the pan tilt zoom unit.
//       token - required; [ReferenceToken]
//     Token that uniquely references this configuration. Length up to 64 characters.
//       Name [Name]
//     User readable name. Length up to 64 characters.
//       UseCount [int]
//     Number of internal references currently using this configuration.
//
//       This informational parameter is read-only. Deprecated for Media2 Service.
//       MoveRamp [int]
//     The optional acceleration ramp used by the device when moving.
//       PresetRamp [int]
//     The optional acceleration ramp used by the device when recalling presets.
//       PresetTourRamp [int]
//     The optional acceleration ramp used by the device when executing PresetTours.
//       NodeToken [ReferenceToken]
//     A mandatory reference to the PTZ Node that the PTZ Configuration belongs to.
//       DefaultAbsolutePantTiltPositionSpace - optional; [anyURI]
//     If the PTZ Node supports absolute Pan/Tilt movements, it shall specify one Absolute Pan/Tilt Position Space as default.
//     DefaultAbsoluteZoomPositionSpace - optional; [anyURI]
//     If the PTZ Node supports absolute zoom movements, it shall specify one Absolute Zoom Position Space as default.
//     DefaultRelativePanTiltTranslationSpace - optional; [anyURI]
//     If the PTZ Node supports relative Pan/Tilt movements, it shall specify one RelativePan/Tilt Translation Space as default.
//     DefaultRelativeZoomTranslationSpace - optional; [anyURI]
//     If the PTZ Node supports relative zoom movements, it shall specify one Relative Zoom Translation Space as default.
//     DefaultContinuousPanTiltVelocitySpace - optional; [anyURI]
//     If the PTZ Node supports continuous Pan/Tilt movements, it shall specify one Continuous Pan/Tilt Velocity Space as default.
//     DefaultContinuousZoomVelocitySpace - optional; [anyURI]
//     If the PTZ Node supports continuous zoom movements, it shall specify one Continuous Zoom Velocity Space as default.
//     DefaultPTZSpeed - optional; [PTZSpeed]
//     If the PTZ Node supports absolute or relative PTZ movements, it shall specify corresponding default Pan/Tilt and Zoom speeds.
//     PanTilt - optional; [Vector2D]
//     Pan and tilt speed. The x component corresponds to pan and the y component to tilt. If omitted in a request, the current (if any) PanTilt movement should not be affected.
//       Zoom - optional; [Vector1D]
//     A zoom speed. If omitted in a request, the current (if any) Zoom movement should not be affected.
//       DefaultPTZTimeout - optional; [duration]
//     If the PTZ Node supports continuous movements, it shall specify a default timeout, after which the movement stops.
//     PanTiltLimits - optional; [PanTiltLimits]
//     The Pan/Tilt limits element should be present for a PTZ Node that supports an absolute Pan/Tilt. If the element is present it signals the support for configurable Pan/Tilt limits. If limits are enabled, the Pan/Tilt movements shall always stay within the specified range. The Pan/Tilt limits are disabled by setting the limits to –INF or +INF.
//       Range [Space2DDescription]
//     A range of pan tilt limits.
//       URI [anyURI]
//     A URI of coordinate systems.
//       XRange [FloatRange]
//     A range of x-axis.
//       Min [float]
//     Max [float]
//     YRange [FloatRange]
//     A range of y-axis.
//       Min [float]
//     Max [float]
//     ZoomLimits - optional; [ZoomLimits]
//     The Zoom limits element should be present for a PTZ Node that supports absolute zoom. If the element is present it signals the supports for configurable Zoom limits. If limits are enabled the zoom movements shall always stay within the specified range. The Zoom limits are disabled by settings the limits to -INF and +INF.
//       Range [Space1DDescription]
//     A range of zoom limit
//     URI [anyURI]
//     A URI of coordinate systems.
//       XRange [FloatRange]
//     A range of x-axis.
//       Min [float]
//     Max [float]
//     Extension - optional; [PTZConfigurationExtension]
//     PTControlDirection - optional; [PTControlDirection]
//     Optional element to configure PT Control Direction related features.
//       EFlip - optional; [EFlip]
//     Optional element to configure related parameters for E-Flip.
//       Mode [EFlipMode]
//       Parameter to enable/disable E-Flip feature.
//     - enum { 'OFF', 'ON', 'Extended' }
//     Reverse - optional; [Reverse]
//     Optional element to configure related parameters for reversing of PT Control Direction.
//       Mode [ReverseMode]
//     Parameter to enable/disable Reverse feature.
//     - enum { 'OFF', 'ON', 'AUTO', 'Extended' }
//     Extension - optional; [PTControlDirectionExtension]
//     Extension - optional; [PTZConfigurationExtension2]
//     MetadataConfiguration - optional; [MetadataConfiguration]
//     Optional configuration of the metadata stream.
//       token - required; [ReferenceToken]
//     Token that uniquely references this configuration. Length up to 64 characters.
//       Name [Name]
//     User readable name. Length up to 64 characters.
//       UseCount [int]
//     Number of internal references currently using this configuration.
//
//       This informational parameter is read-only. Deprecated for Media2 Service.
//       CompressionType [string]
//     Optional parameter to configure compression type of Metadata payload. Use values from enumeration MetadataCompressionType.
//       GeoLocation [boolean]
//     Optional parameter to configure if the metadata stream shall contain the Geo Location coordinates of each target.
//       ShapePolygon [boolean]
//     Optional parameter to configure if the generated metadata stream should contain shape information as polygon.
//       PTZStatus - optional; [PTZFilter]
//     optional element to configure which PTZ related data is to include in the metadata stream
//     Status [boolean]
//     True if the metadata stream shall contain the PTZ status (IDLE, MOVING or UNKNOWN)
//     Position [boolean]
//     True if the metadata stream shall contain the PTZ position
//     Events - optional; [EventSubscription]
//     Optional element to configure the streaming of events. A client might be interested in receiving all, none or some of the events produced by the device:
//       To get all events: Include the Events element but do not include a filter.
//       To get no events: Do not include the Events element.
//       To get only some events: Include the Events element and include a filter in the element.
//       Filter - optional; [FilterType]
//     SubscriptionPolicy - optional;
//     Analytics - optional; [boolean]
//     Defines whether the streamed metadata will include metadata from the analytics engines (video, cell motion, audio etc.)
//     Multicast [MulticastConfiguration]
//     Defines the multicast settings that could be used for video streaming.
//       Address [IPAddress]
//     The multicast address (if this address is set to 0 no multicast streaming is enaled)
//     Type [IPType]
//     Indicates if the address is an IPv4 or IPv6 address.
//     - enum { 'IPv4', 'IPv6' }
//     IPv4Address - optional; [IPv4Address]
//     IPv4 address.
//       IPv6Address - optional; [IPv6Address]
//     IPv6 address
//     Port [int]
//     The RTP mutlicast destination port. A device may support RTCP. In this case the port value shall be even to allow the corresponding RTCP stream to be mapped to the next higher (odd) destination port number as defined in the RTSP specification.
//     TTL [int]
//     In case of IPv6 the TTL value is assumed as the hop limit. Note that for IPV6 and administratively scoped IPv4 multicast the primary use for hop limit / TTL is to prevent packets from (endlessly) circulating and not limiting scope. In these cases the address contains the scope.
//     AutoStart [boolean]
//     Read only property signalling that streaming is persistant. Use the methods StartMulticastStreaming and StopMulticastStreaming to switch its state.
//       SessionTimeout [duration]
//       The rtsp session timeout for the related audio stream (when using Media2 Service, this value is deprecated and ignored)
//       AnalyticsEngineConfiguration - optional; [AnalyticsEngineConfiguration]
//       Indication which AnalyticsModules shall output metadata. Note that the streaming behavior is undefined if the list includes items that are not part of the associated AnalyticsConfiguration.
//         AnalyticsModule - optional, unbounded; [Config]
//       Name - required; [string]
//       Name of the configuration.
//         Type - required; [QName]
//       The Type attribute specifies the type of rule and shall be equal to value of one of Name attributes of ConfigDescription elements returned by GetSupportedRules and GetSupportedAnalyticsModules command.
//         Parameters [ItemList]
//       List of configuration parameters as defined in the corresponding description.
//         SimpleItem - optional, unbounded;
//       Value name pair as defined by the corresponding description.
//         Name - required; [string]
//       Item name.
//         Value - required; [anySimpleType]
//       Item value. The type is defined in the corresponding description.
//         ElementItem - optional, unbounded;
//       Complex value structure.
//         Name - required; [string]
//       Item name.
//         Extension - optional; [ItemListExtension]
//       Extension - optional; [AnalyticsEngineConfigurationExtension]
//       Extension - optional; [MetadataConfigurationExtension]
//       Extension - optional; [ProfileExtension]
//       Extensions defined in ONVIF 2.0
//       AudioOutputConfiguration - optional; [AudioOutputConfiguration]
//       Optional configuration of the Audio output.
//         token - required; [ReferenceToken]
//       Token that uniquely references this configuration. Length up to 64 characters.
//         Name [Name]
//       User readable name. Length up to 64 characters.
//         UseCount [int]
//       Number of internal references currently using this configuration.
//
//         This informational parameter is read-only. Deprecated for Media2 Service.
//         OutputToken [ReferenceToken]
//       Token of the phsycial Audio output.
//         SendPrimacy - optional; [anyURI]
//       An audio channel MAY support different types of audio transmission. While for full duplex operation no special handling is required, in half duplex operation the transmission direction needs to be switched. The optional SendPrimacy parameter inside the AudioOutputConfiguration indicates which direction is currently active. An NVC can switch between different modes by setting the AudioOutputConfiguration.
//
//         The following modes for the Send-Primacy are defined:
//         www.onvif.org/ver20/HalfDuplex/Server The server is allowed to send audio data to the client. The client shall not send audio data via the backchannel to the NVT in this mode.
//         www.onvif.org/ver20/HalfDuplex/Client The client is allowed to send audio data via the backchannel to the server. The NVT shall not send audio data to the client in this mode.
//         www.onvif.org/ver20/HalfDuplex/Auto It is up to the device how to deal with sending and receiving audio data.
//         Acoustic echo cancellation is out of ONVIF scope.
//         OutputLevel [int]
//         Volume setting of the output. The applicable range is defined via the option AudioOutputOptions.OutputLevelRange.
//           AudioDecoderConfiguration - optional; [AudioDecoderConfiguration]
//         Optional configuration of the Audio decoder.
//           token - required; [ReferenceToken]
//         Token that uniquely references this configuration. Length up to 64 characters.
//           Name [Name]
//         User readable name. Length up to 64 characters.
//           UseCount [int]
//         Number of internal references currently using this configuration.
//
//           This informational parameter is read-only. Deprecated for Media2 Service.
//           Extension - optional; [ProfileExtension2]
}

interface MediaProfile {

}

export class Media {
  private onvif: Onvif;

  constructor(onvif: Onvif) {
    this.onvif = onvif;
  }

  /**
   * Receive profiles
   */
  async getProfiles(): Promise<[Profile | MediaProfile]> {
    if (this.onvif.device.media2Support) {
      // Profile T request using Media2
      // The reply is in a different format to the old API so we convert the data from the new API to the old structure
      // for backwards compatibility with existing users of this library
      const [data] = await this.onvif.request({
        service : 'media2',
        body    : '<GetProfiles xmlns="http://www.onvif.org/ver20/media/wsdl">'
          + '<Type>All</Type>'
          + '</GetProfiles>}',
      });

      // Slight difference in Media1 and Media2 reply XML
      // Generate a reply that looks like a Media1 reply for existing library users
      this.onvif.profiles = data[0].getProfilesResponse[0].profiles.map((profile: Record<string, unknown>) => {
        const tmp = linerase(profile);
        const newProfile = {};
        newProfile.$ = tmp.$; // copy Profile Token
        newProfile.name = tmp.name;
        // Media2 Spec says there will be these some or all of these configuration entities
        // Video source configuration
        // Audio source configuration
        // Video encoder configuration
        // Audio encoder configuration
        // PTZ configuration
        // Video analytics configuration
        // Metadata configuration
        // Audio output configuration
        // Audio decoder configuration
        if (tmp.configurations.videoSource) { newProfile.videoSourceConfiguration = tmp.configurations.videoSource; }
        if (tmp.configurations.audioSource) { newProfile.audioSourceConfiguration = tmp.configurations.audioSource; }
        if (tmp.configurations.videoEncoder) { newProfile.videoEncoderConfiguration = tmp.configurations.videoEncoder; }
        if (tmp.configurations.audioEncoder) { newProfile.audioEncoderConfiguration = tmp.configurations.audioEncoder; }
        if (tmp.configurations.PTZ) { newProfile.PTZConfiguration = tmp.configurations.PTZ; }
        if (tmp.configurations.analytics) { newProfile.analyticsConfiguration = tmp.configurations.analytics; }
        if (tmp.configurations.metadata) { newProfile.metadataConfiguration = tmp.configurations.metadata; }
        if (tmp.configurations.audioOutput) { newProfile.audioOutputConfiguration = tmp.configurations.audioOutput; }
        if (tmp.configurations.audioOutput) { newProfile.audioDecoderConfiguration = tmp.configurations.audioDecoder; }

        // TODO - Add Audio
        return newProfile;
      });
      if (callback) {
        callback.call(this, err, this.profiles, xml);
      }
    }
    this.onvif.profiles[0].videoSourceConfiguration!.extension.rotate;
    return [{}];
  }
}