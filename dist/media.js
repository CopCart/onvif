"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const utils_1 = require("./utils");
class Media {
    constructor(onvif) {
        this.profiles = [];
        this.videoSources = [];
        this.onvif = onvif;
    }
    /**
     * Receive profiles
     */
    async getProfiles() {
        if (this.onvif.device.media2Support) {
            // Profile T request using Media2
            // The reply is in a different format to the old API so we convert the data from the new API to the old structure
            // for backwards compatibility with existing users of this library
            const [data] = await this.onvif.request({
                service: 'media2',
                body: '<GetProfiles xmlns="http://www.onvif.org/ver20/media/wsdl"><Type>All</Type></GetProfiles>',
            });
            // Slight difference in Media1 and Media2 reply XML
            // Generate a reply that looks like a Media1 reply for existing library users
            this.profiles = data[0].getProfilesResponse[0].profiles.map((profile) => {
                const tmp = (0, utils_1.linerase)(profile);
                const newProfile = {
                    token: tmp.token,
                    name: tmp.name,
                    fixed: tmp.fixed || false,
                };
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
                if (tmp.configurations.videoSource) {
                    newProfile.videoSourceConfiguration = tmp.configurations.videoSource;
                }
                if (tmp.configurations.audioSource) {
                    newProfile.audioSourceConfiguration = tmp.configurations.audioSource;
                }
                if (tmp.configurations.videoEncoder) {
                    newProfile.videoEncoderConfiguration = tmp.configurations.videoEncoder;
                }
                if (tmp.configurations.audioEncoder) {
                    newProfile.audioEncoderConfiguration = tmp.configurations.audioEncoder;
                }
                if (tmp.configurations.PTZ) {
                    newProfile.PTZConfiguration = tmp.configurations.PTZ;
                }
                if (tmp.configurations.analytics) {
                    newProfile.videoAnalyticsConfiguration = tmp.configurations.analytics;
                }
                if (tmp.configurations.metadata) {
                    newProfile.metadataConfiguration = tmp.configurations.metadata;
                }
                if (tmp.configurations.audioOutput || tmp.configurations.audioDecoder) {
                    newProfile.extension = {
                        audioOutputConfiguration: tmp.configurations.audioOutput,
                        audioDecoderConfiguration: tmp.configurations.audioDecoder,
                    };
                }
                // TODO - Add Audio
                return newProfile;
            });
            return this.profiles;
        }
        // Original ONVIF Media support (used in Profile S)
        const [data] = await this.onvif.request({
            service: 'media',
            body: '<GetProfiles xmlns="http://www.onvif.org/ver10/media/wsdl"/>',
        });
        this.profiles = data[0].getProfilesResponse[0].profiles.map(utils_1.linerase);
        return this.profiles;
    }
    async getVideoSources() {
        const [data] = await this.onvif.request({
            service: 'media',
            body: '<GetVideoSources xmlns="http://www.onvif.org/ver10/media/wsdl"/>',
        });
        this.videoSources = (0, utils_1.linerase)(data).getVideoSourcesResponse.videoSources;
        // videoSources is an array of video sources, but linerase remove the array if there is only one element inside,
        // so we convert it back to an array
        if (!Array.isArray(this.videoSources)) {
            this.videoSources = [this.videoSources];
        }
        return this.videoSources;
    }
    /**
     * This method requests a URI that can be used to initiate a live media stream using RTSP as the control protocol.
     * The returned URI shall remain valid indefinitely even if the profile is changed.
     * Method uses Media2 if device supports it.
     *
     * For Media2 you need to provide only `protocol` parameter ('RTPS' by default). Here is supported values from the
     * ONVIF documentation:
     * Defined stream types are
     * - RtspUnicast RTSP streaming RTP as UDP Unicast.
     * - RtspMulticast RTSP streaming RTP as UDP Multicast.
     * - RTSP RTSP streaming RTP over TCP.
     * - RtspOverHttp Tunneling both the RTSP control channel and the RTP stream over HTTP or HTTPS.
     *
     * For Media1 you need to set both parameters: protocl and stream (RTP-Unicast by default) If Media2 supported
     * by device, this parameters will be converted to Media2 call. This is excerpt from ONVIF documentation:
     * The correct syntax for the StreamSetup element for these media stream setups defined in 5.1.1 of the streaming specification are as follows:
     * - RTP unicast over UDP: StreamType = "RTP_unicast", TransportProtocol = "UDP"
     * - RTP over RTSP over HTTP over TCP: StreamType = "RTP_unicast", TransportProtocol = "HTTP"
     * - RTP over RTSP over TCP: StreamType = "RTP_unicast", TransportProtocol = "RTSP"
     */
    async getStreamUri(options = {}) {
        const { profileToken, stream = 'RTP-Unicast', } = options;
        let { protocol = 'RTSP' } = options;
        if (this.onvif.device.media2Support) {
            // Permitted values for options.protocol are :-
            //   RtspUnicast - RTSP streaming RTP via UDP Unicast.
            //   RtspMulticast - RTSP streaming RTP via UDP Multicast.
            //   RTSP - RTSP streaming RTP over TCP.
            //   RtspOverHttp - Tunneling both the RTSP control channel and the RTP stream over HTTP or HTTPS.
            // For backwards compatibility this function will convert Media1 Stream and Transport Protocol to a Media2 protocol
            if (protocol === 'HTTP') {
                protocol = 'RtspOverHttp';
            }
            if (protocol === 'TCP') {
                protocol = 'RTSP';
            }
            if (protocol === 'UDP' && stream === 'RTP-Unicast') {
                protocol = 'RtspUnicast';
            }
            if (protocol === 'UDP' && stream === 'RTP-Multicast') {
                protocol = 'RtspMulticast';
            }
            // Profile T request using Media2
            const [data] = await this.onvif.request({
                service: 'media2',
                body: '<GetStreamUri xmlns="http://www.onvif.org/ver20/media/wsdl">'
                    + `<Protocol>${protocol}</Protocol>`
                    + `<ProfileToken>${profileToken || this.onvif.activeSource.profileToken}</ProfileToken>`
                    + '</GetStreamUri>',
            });
            return (0, utils_1.linerase)(data).getStreamUriResponse;
        }
        // Original (v.1.0)  ONVIF Specification for Media (used in Profile S)
        const [data] = await this.onvif.request({
            service: 'media',
            body: '<GetStreamUri xmlns="http://www.onvif.org/ver10/media/wsdl">'
                + '<StreamSetup>'
                + `<Stream xmlns="http://www.onvif.org/ver10/schema">${stream}</Stream>`
                + '<Transport xmlns="http://www.onvif.org/ver10/schema">'
                + `<Protocol>${protocol || 'RTSP'}</Protocol>`
                + '</Transport>'
                + '</StreamSetup>'
                + `<ProfileToken>${profileToken || this.onvif.activeSource.profileToken}</ProfileToken>`
                + '</GetStreamUri>',
        });
        return (0, utils_1.linerase)(data).getStreamUriResponse.mediaUri;
    }
    /**
     * Receive snapshot URI
     * @param profileToken
     */
    async getSnapshotUri({ profileToken } = {}) {
        if (this.onvif.device.media2Support) {
            // Profile T request using Media2
            const [data] = await this.onvif.request({
                service: 'media2',
                body: '<GetSnapshotUri xmlns="http://www.onvif.org/ver20/media/wsdl">'
                    + `<ProfileToken>${profileToken || this.onvif.activeSource.profileToken}</ProfileToken>`
                    + '</GetSnapshotUri>',
            });
            return (0, utils_1.linerase)(data).getSnapshotUriResponse;
        }
        const [data] = await this.onvif.request({
            service: 'media',
            body: '<GetSnapshotUri xmlns="http://www.onvif.org/ver10/media/wsdl">'
                + `<ProfileToken>${profileToken || this.onvif.activeSource.profileToken}</ProfileToken>`
                + '</GetSnapshotUri>',
        });
        return (0, utils_1.linerase)(data).getSnapshotUriResponse.mediaUri;
    }
}
exports.Media = Media;
//# sourceMappingURL=media.js.map