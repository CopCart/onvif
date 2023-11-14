"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Device_services, _Device_scopes, _Device_serviceCapabilities, _Device_NTP, _Device_DNS, _Device_networkInterfaces;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const url_1 = __importDefault(require("url"));
const utils_1 = require("./utils");
/**
 * Device methods
 */
class Device {
    constructor(onvif) {
        _Device_services.set(this, []);
        this.media2Support = false;
        _Device_scopes.set(this, []);
        _Device_serviceCapabilities.set(this, {});
        _Device_NTP.set(this, void 0);
        _Device_DNS.set(this, void 0);
        _Device_networkInterfaces.set(this, void 0);
        this.onvif = onvif;
    }
    get services() {
        return __classPrivateFieldGet(this, _Device_services, "f");
    }
    get scopes() { return __classPrivateFieldGet(this, _Device_scopes, "f"); }
    get serviceCapabilities() { return __classPrivateFieldGet(this, _Device_serviceCapabilities, "f"); }
    get NTP() { return __classPrivateFieldGet(this, _Device_NTP, "f"); }
    get DNS() { return __classPrivateFieldGet(this, _Device_NTP, "f"); }
    get newtworkInterfaces() { return __classPrivateFieldGet(this, _Device_networkInterfaces, "f"); }
    getSystemDateAndTime() {
        return this.onvif.getSystemDateAndTime();
    }
    setSystemDateAndTime(options) {
        return this.onvif.setSystemDateAndTime(options);
    }
    /**
     * Returns information about services of the device.
     */
    async getServices(includeCapability = true) {
        const [data] = await this.onvif.request({
            body: '<GetServices xmlns="http://www.onvif.org/ver10/device/wsdl">'
                + `<IncludeCapability>${includeCapability}</IncludeCapability>`
                + '</GetServices>',
        });
        __classPrivateFieldSet(this, _Device_services, (0, utils_1.linerase)(data).getServicesResponse.service, "f");
        // ONVIF Profile T introduced Media2 (ver20) so cameras from around 2020/2021 will have
        // two media entries in the ServicesResponse, one for Media (ver10/media) and one for Media2 (ver20/media)
        // This is so that existing VMS software can still access the video via the orignal ONVIF Media API
        // fill Cam#uri property
        __classPrivateFieldGet(this, _Device_services, "f").forEach((service) => {
            // Look for services with namespaces and XAddr values
            if (Object.prototype.hasOwnProperty.call(service, 'namespace') && Object.prototype.hasOwnProperty.call(service, 'XAddr')) {
                // Only parse ONVIF namespaces. Axis cameras return Axis namespaces in GetServices
                const parsedNamespace = url_1.default.parse(service.namespace);
                if (parsedNamespace.hostname === 'www.onvif.org' && parsedNamespace.path) {
                    const namespaceSplitted = parsedNamespace.path.substring(1).split('/'); // remove leading Slash, then split
                    if (namespaceSplitted[1] === 'media' && namespaceSplitted[0] === 'ver20') {
                        // special case for Media and Media2 where cameras supporting Profile S and Profile T (2020/2021 models) have two media services
                        this.media2Support = true;
                        namespaceSplitted[1] = 'media2';
                    }
                    else if (namespaceSplitted[1] === 'ptz') {
                        // uppercase PTZ namespace to fit names convention
                        namespaceSplitted[1] = 'PTZ';
                    }
                    this.onvif.uri[namespaceSplitted[1]] = this.onvif.parseUrl(service.XAddr);
                }
            }
        });
        return __classPrivateFieldGet(this, _Device_services, "f");
    }
    /**
     * This method has been replaced by the more generic {@link Device.getServices | GetServices} method.
     * For capabilities of individual services refer to the GetServiceCapabilities methods.
     */
    async getCapabilities() {
        const [data] = await this.onvif.request({
            body: '<GetCapabilities xmlns="http://www.onvif.org/ver10/device/wsdl">'
                + '<Category>All</Category>'
                + '</GetCapabilities>',
        });
        this.onvif.capabilities = (0, utils_1.linerase)(data[0].getCapabilitiesResponse[0].capabilities[0]);
        ['PTZ', 'media', 'imaging', 'events', 'device'].forEach((name) => {
            const capabilityName = name;
            if ('XAddr' in this.onvif.capabilities[capabilityName]) {
                this.onvif.uri[name] = this.onvif.parseUrl(this.onvif.capabilities[capabilityName].XAddr);
            }
        });
        // extensions, eg. deviceIO
        if (this.onvif.capabilities.extension) {
            Object.keys(this.onvif.capabilities.extension).forEach((ext) => {
                const extensionName = ext;
                // TODO think about complex extensions like `telexCapabilities` and `scdlCapabilities`
                if (extensionName !== 'XAddr' && 'XAddr' in this.onvif.capabilities.extension[extensionName]) {
                    this.onvif.uri[extensionName] = new URL(this.onvif.capabilities.extension[extensionName].XAddr);
                }
            });
            // HACK for a Profile G NVR that has 'replay' but did not have 'recording' in GetCapabilities
            if (this.onvif.uri.replay && !this.onvif.uri.recording) {
                const tempRecorderXaddr = this.onvif.uri.replay.href.replace('replay', 'recording');
                this.onvif.emit('warn', `Adding ${tempRecorderXaddr} for bad Profile G device`);
                this.onvif.uri.recording = new URL(tempRecorderXaddr);
            }
        }
        return this.onvif.capabilities;
    }
    /**
     * Receive device information
     */
    async getDeviceInformation() {
        const [data] = await this.onvif.request({ body: '<GetDeviceInformation xmlns="http://www.onvif.org/ver10/device/wsdl"/>' });
        this.onvif.deviceInformation = (0, utils_1.linerase)(data).getDeviceInformationResponse;
        return this.onvif.deviceInformation;
    }
    /**
     * Receive hostname information
     */
    async getHostname() {
        const [data] = await this.onvif.request({
            body: '<GetHostname xmlns="http://www.onvif.org/ver10/device/wsdl"/>',
        });
        return (0, utils_1.linerase)(data).getHostnameResponse.hostnameInformation;
    }
    /**
     * Receive the scope parameters of a device
     */
    async getScopes() {
        const [data] = await this.onvif.request({
            body: '<GetScopes xmlns="http://www.onvif.org/ver10/device/wsdl"/>',
        });
        __classPrivateFieldSet(this, _Device_scopes, (0, utils_1.linerase)(data).getScopesResponse.scopes, "f");
        if (__classPrivateFieldGet(this, _Device_scopes, "f") === undefined) {
            __classPrivateFieldSet(this, _Device_scopes, [], "f");
        }
        else if (!Array.isArray(__classPrivateFieldGet(this, _Device_scopes, "f"))) {
            __classPrivateFieldSet(this, _Device_scopes, [__classPrivateFieldGet(this, _Device_scopes, "f")], "f");
        }
        return __classPrivateFieldGet(this, _Device_scopes, "f");
    }
    /**
     * Set the scope parameters of a device
     * @param scopes Array of scope's uris
     */
    async setScopes(scopes) {
        const [data] = await this.onvif.request({
            body: `<SetScopes xmlns="http://www.onvif.org/ver10/device/wsdl">${scopes.map((uri) => `<Scopes>${uri}</Scopes>`).join('')}</SetScopes>`,
        });
        if ((0, utils_1.linerase)(data).setScopesResponse !== '') {
            throw new Error('Wrong `SetScopes` response');
        }
        // get new scopes from device
        return this.getScopes();
    }
    /**
     * Returns the capabilities of the device service. The result is returned in a typed answer
     */
    async getServiceCapabilities() {
        const [data] = await this.onvif.request({
            body: '<GetServiceCapabilities xmlns="http://www.onvif.org/ver10/device/wsdl" />',
        });
        const capabilitiesResponse = (0, utils_1.linerase)(data);
        __classPrivateFieldSet(this, _Device_serviceCapabilities, {
            network: capabilitiesResponse.getServiceCapabilitiesResponse.capabilities.network,
            security: capabilitiesResponse.getServiceCapabilitiesResponse.capabilities.security,
            system: capabilitiesResponse.getServiceCapabilitiesResponse.capabilities.system,
        }, "f");
        if (capabilitiesResponse.getServiceCapabilitiesResponse.capabilities.misc) {
            __classPrivateFieldGet(this, _Device_serviceCapabilities, "f").misc = capabilitiesResponse.getServiceCapabilitiesResponse.capabilities.misc;
            __classPrivateFieldGet(this, _Device_serviceCapabilities, "f").auxiliaryCommands = capabilitiesResponse.getServiceCapabilitiesResponse.capabilities.misc.AuxiliaryCommands.split(' ');
        }
        return __classPrivateFieldGet(this, _Device_serviceCapabilities, "f");
    }
    /**
     * This operation reboots the device
     */
    async systemReboot() {
        return this.onvif.request({
            service: 'device',
            body: '<SystemReboot xmlns="http://www.onvif.org/ver10/device/wsdl"/>',
        }).then(([data]) => data[0].systemRebootResponse[0].message[0]);
    }
    /**
     * This operation gets the NTP settings from a device. If the device supports NTP, it shall be possible to get the
     * NTP server settings through the GetNTP command.
     */
    async getNTP() {
        const [data] = await this.onvif.request({
            service: 'device',
            body: '<GetNTP xmlns="http://www.onvif.org/ver10/device/wsdl"/>',
        });
        __classPrivateFieldSet(this, _Device_NTP, (0, utils_1.linerase)(data[0].getNTPResponse[0].NTPInformation[0]), "f");
        if (__classPrivateFieldGet(this, _Device_NTP, "f")?.NTPManual && !Array.isArray(__classPrivateFieldGet(this, _Device_NTP, "f").NTPManual)) {
            __classPrivateFieldGet(this, _Device_NTP, "f").NTPManual = [__classPrivateFieldGet(this, _Device_NTP, "f").NTPManual];
        }
        if (__classPrivateFieldGet(this, _Device_NTP, "f")?.NTPFromDHCP && !Array.isArray(__classPrivateFieldGet(this, _Device_NTP, "f").NTPFromDHCP)) {
            __classPrivateFieldGet(this, _Device_NTP, "f").NTPFromDHCP = [__classPrivateFieldGet(this, _Device_NTP, "f").NTPFromDHCP];
        }
        return __classPrivateFieldGet(this, _Device_NTP, "f");
    }
    /**
     * This operation gets the DNS settings from a device. The device shall return its DNS configurations through the
     * GetDNS command.
     */
    async getDNS() {
        const [data] = await this.onvif.request({
            service: 'device',
            body: '<GetDNS xmlns="http://www.onvif.org/ver10/device/wsdl"/>',
        });
        __classPrivateFieldSet(this, _Device_DNS, (0, utils_1.linerase)(data[0].getDNSResponse[0].DNSInformation), "f");
        if (__classPrivateFieldGet(this, _Device_DNS, "f")?.DNSManual && !Array.isArray(__classPrivateFieldGet(this, _Device_DNS, "f").DNSManual)) {
            __classPrivateFieldGet(this, _Device_DNS, "f").DNSManual = [__classPrivateFieldGet(this, _Device_DNS, "f").DNSManual];
        }
        if (__classPrivateFieldGet(this, _Device_DNS, "f")?.DNSFromDHCP && !Array.isArray(__classPrivateFieldGet(this, _Device_DNS, "f").DNSFromDHCP)) {
            __classPrivateFieldGet(this, _Device_DNS, "f").DNSFromDHCP = [__classPrivateFieldGet(this, _Device_DNS, "f").DNSFromDHCP];
        }
        return __classPrivateFieldGet(this, _Device_DNS, "f");
    }
    /**
     * This operation gets the network interface configuration from a device. The device shall support return of network
     * interface configuration settings as defined by the NetworkInterface type through the GetNetworkInterfaces command.
     */
    async getNetworkInterfaces() {
        const [data] = await this.onvif.request({
            service: 'device',
            body: '<GetNetworkInterfaces xmlns="http://www.onvif.org/ver10/device/wsdl"/>',
        });
        const networkInterfaces = (0, utils_1.linerase)(data[0].getNetworkInterfacesResponse[0].networkInterfaces);
        // networkInterfaces is an array of network interfaces, but linerase remove the array if there is only one element inside
        // so we convert it back to an array
        if (!Array.isArray(networkInterfaces)) {
            __classPrivateFieldSet(this, _Device_networkInterfaces, [networkInterfaces], "f");
        }
        else {
            __classPrivateFieldSet(this, _Device_networkInterfaces, networkInterfaces, "f");
        }
        return __classPrivateFieldGet(this, _Device_networkInterfaces, "f");
    }
}
exports.Device = Device;
_Device_services = new WeakMap(), _Device_scopes = new WeakMap(), _Device_serviceCapabilities = new WeakMap(), _Device_NTP = new WeakMap(), _Device_DNS = new WeakMap(), _Device_networkInterfaces = new WeakMap();
//# sourceMappingURL=device.js.map