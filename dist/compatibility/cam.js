"use strict";
/**
 * Module to provide backward compatibility with versions 0.x
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cam = void 0;
const events_1 = require("events");
const onvif_1 = require("../onvif");
class Cam extends events_1.EventEmitter {
    constructor(options, callback) {
        super();
        this.onvif = new onvif_1.Onvif({
            ...options,
            autoConnect: callback !== undefined ? false : options.autoconnect,
        });
        if (callback) {
            this.onvif.connect().then((result) => callback(null, result)).catch(callback);
        }
    }
    get port() { return this.onvif.port; }
    get path() { return this.onvif.path; }
    set hostname(name) { this.onvif.hostname = name; }
    set timeout(time) { this.onvif.timeout = time; }
    get timeout() { return this.onvif.timeout; }
    get services() { return this.onvif.device.services; }
    get capabilities() { return this.onvif.capabilities; }
    get uri() { return this.onvif.uri; }
    get videoSources() { return this.onvif.media.videoSources; }
    get profiles() { return this.onvif.media.profiles; }
    get defaultProfile() { return this.onvif.defaultProfile; }
    get defaultProfiles() { return this.onvif.defaultProfiles; }
    get activeSource() { return this.onvif.activeSource; }
    get serviceCapabilities() { return this.onvif.device.serviceCapabilities; }
    get deviceInformation() { return this.onvif.deviceInformation; }
    get nodes() { return this.onvif.ptz.nodes; }
    get configurations() { return this.onvif.ptz.configurations; }
    get presets() {
        return Object.fromEntries(Object.values(this.onvif.ptz.presets)
            .map((preset) => [preset.name, preset.token]));
    }
    connect(callback) {
        this.onvif.connect().then((result) => callback(null, result)).catch(callback);
    }
    _request(options, callback) {
        if (typeof callback !== 'function') {
            throw new Error('`callback` must be a function');
        }
        this.onvif.request(options).then((result) => callback(null, result)).catch(callback);
    }
    getSystemDateAndTime(callback) {
        this.onvif.device.getSystemDateAndTime().then((result) => callback(null, result)).catch(callback);
    }
    setSystemDateAndTime(value, callback) {
        this.onvif.device.setSystemDateAndTime(value).then((result) => callback(null, result)).catch(callback);
    }
    getHostname(callback) {
        this.onvif.device.getHostname().then((result) => callback(null, result)).catch(callback);
    }
    getScopes(callback) {
        this.onvif.device.getScopes().then((result) => callback(null, result)).catch(callback);
    }
    setScopes(value, callback) {
        this.onvif.device.setScopes(value).then((result) => callback(null, result)).catch(callback);
    }
    getCapabilities(callback) {
        this.onvif.device.getCapabilities().then((result) => callback(null, result)).catch(callback);
    }
    getServiceCapabilities(callback) {
        this.onvif.device.getServiceCapabilities()
            .then((result) => callback(null, result)).catch(callback);
    }
    getActiveSources(callback) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.onvif.getActiveSources().then((result) => callback(null, result)).catch(callback);
    }
    getVideoSources(callback) {
        this.onvif.media.getVideoSources().then((result) => callback(null, result)).catch(callback);
    }
    getServices(includeCapability, callback) {
        this.onvif.device.getServices(includeCapability)
            .then((result) => callback(null, result)).catch(callback);
    }
    getDeviceInformation(callback) {
        this.onvif.device.getDeviceInformation()
            .then((result) => callback(null, result)).catch(callback);
    }
    getStreamUri(options, callback) {
        if (callback) {
            this.onvif.media.getStreamUri(options)
                .then((result) => callback(null, result)).catch(callback);
        }
        this.onvif.media.getStreamUri()
            .then((result) => options(null, result)).catch(options);
    }
    getSnapshotUri(options, callback) {
        if (callback) {
            this.onvif.media.getSnapshotUri(options)
                .then((result) => callback(null, result)).catch(callback);
        }
        this.onvif.media.getSnapshotUri().then((result) => options(null, result))
            .catch(options);
    }
    getNodes(callback) {
        this.onvif.ptz.getNodes().then((result) => callback(null, result)).catch(callback);
    }
    getConfigurations(callback) {
        this.onvif.ptz.getConfigurations().then((result) => callback(null, result)).catch(callback);
    }
    getConfigurationOptions(configurationToken, callback) {
        this.onvif.ptz.getConfigurationOptions({ configurationToken })
            .then((result) => callback(null, result)).catch(callback);
    }
    systemReboot(callback) {
        this.onvif.device.systemReboot().then((result) => callback(null, result)).catch(callback);
    }
    getPresets(options, callback) {
        if (callback) {
            this.onvif.ptz.getPresets(options)
                .then((result) => callback(null, Object.fromEntries(Object.values(result).map((preset) => [preset.name, preset.token]))))
                .catch(callback);
        }
        this.onvif.ptz.getPresets()
            .then((result) => options(null, Object.fromEntries(Object.values(result).map((preset) => [preset.name, preset.token]))))
            .catch(options);
    }
    gotoPreset(options, callback) {
        this.onvif.ptz.gotoPreset(options).then((result) => callback(null, result)).catch(callback);
    }
    setPreset(options, callback) {
        this.onvif.ptz.setPreset(options).then((result) => callback(null, result)).catch(callback);
    }
    removePreset(options, callback) {
        this.onvif.ptz.removePreset(options).then((result) => callback(null, result)).catch(callback);
    }
    gotoHomePosition(options, callback) {
        this.onvif.ptz.gotoHomePosition(options).then((result) => callback(null, result)).catch(callback);
    }
    setHomePosition(options, callback) {
        this.onvif.ptz.setHomePosition(options).then((result) => callback(null, result)).catch(callback);
    }
    getStatus(options, callback) {
        if (callback) {
            this.onvif.ptz.getStatus(options).then((result) => callback(null, result)).catch(callback);
        }
        this.onvif.ptz.getStatus().then((result) => options(null, result)).catch(options);
    }
    absoluteMove(compatibilityOptions, callback) {
        const options = {
            ...compatibilityOptions,
            position: {
                panTilt: {
                    x: compatibilityOptions.x,
                    y: compatibilityOptions.y,
                },
                zoom: { x: compatibilityOptions.zoom },
            },
        };
        if (callback) {
            this.onvif.ptz.absoluteMove(options).then((result) => callback(null, result)).catch(callback);
        }
        else {
            this.onvif.ptz.absoluteMove(options).catch((err) => this.emit('error', err));
        }
    }
    relativeMove(compatibilityOptions, callback) {
        const options = {
            ...compatibilityOptions,
            translation: {
                panTilt: {
                    x: compatibilityOptions.x,
                    y: compatibilityOptions.y,
                },
                zoom: { x: compatibilityOptions.zoom },
            },
        };
        if (callback) {
            this.onvif.ptz.relativeMove(options).then((result) => callback(null, result)).catch(callback);
        }
        else {
            this.onvif.ptz.relativeMove(options).catch((err) => this.emit('error', err));
        }
    }
    continuousMove(compatibilityOptions, callback) {
        const options = {
            ...compatibilityOptions,
            velocity: {
                ...(compatibilityOptions.x && compatibilityOptions.y && !compatibilityOptions.onlySendZoom && {
                    panTilt: {
                        x: compatibilityOptions.x,
                        y: compatibilityOptions.y,
                    },
                }),
                ...(compatibilityOptions.zoom && !compatibilityOptions.onlySendPanTilt && {
                    zoom: { x: compatibilityOptions.zoom },
                }),
            },
        };
        if (callback) {
            this.onvif.ptz.continuousMove(options).then((result) => callback(null, result)).catch(callback);
        }
        else {
            this.onvif.ptz.continuousMove(options).catch((err) => this.emit('error', err));
        }
    }
    stop(options, callback) {
        if (callback) {
            this.onvif.ptz.stop(options).then((result) => callback(null, result)).catch(callback);
        }
        this.onvif.ptz.stop().then((result) => {
            if (typeof options === 'function') {
                options(null, result);
            }
        }).catch(options ? options : (error) => this.emit('error', error));
    }
    getNTP(callback) {
        this.onvif.device.getNTP().then((result) => callback(null, result)).catch(callback);
    }
    getDNS(callback) {
        this.onvif.device.getDNS().then((result) => callback(null, result)).catch(callback);
    }
    getNetworkInterfaces(callback) {
        this.onvif.device.getNetworkInterfaces().then((result) => callback(null, result)).catch(callback);
    }
}
exports.Cam = Cam;
//# sourceMappingURL=cam.js.map