"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSOAPString = exports.guid = exports.linerase = void 0;
const xml2js_1 = __importDefault(require("xml2js"));
const numberRE = /^-?([1-9]\d*|0)(\.\d*)?$/;
const dateRE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/;
const prefixMatch = /(?!xmlns)^.*:/;
/**
 * Parse SOAP object to pretty JS-object
 */
function linerase(xml) {
    if (Array.isArray(xml)) {
        if (xml.length > 1) {
            return xml.map(linerase);
        }
        [xml] = xml;
    }
    if (typeof xml === 'object') {
        let obj = {};
        Object.keys(xml).forEach((key) => {
            if (key === '$') { // for xml attributes
                obj = {
                    ...obj,
                    ...linerase(xml.$),
                };
            }
            else {
                obj[key] = linerase(xml[key]);
            }
        });
        return obj;
    }
    if (xml === 'true') {
        return true;
    }
    if (xml === 'false') {
        return false;
    }
    if (numberRE.test(xml)) {
        return parseFloat(xml);
    }
    if (dateRE.test(xml)) {
        return new Date(xml);
    }
    return xml;
}
exports.linerase = linerase;
function s4() {
    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
/**
 * Generate GUID
 * @returns {string}
 */
function guid() {
    return (`${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`);
}
exports.guid = guid;
/**
 * Parse SOAP response
 */
async function parseSOAPString(rawXml) {
    /* Filter out xml name spaces */
    const xml = rawXml.replace(/xmlns([^=]*?)=(".*?")/g, '');
    const result = await xml2js_1.default.parseStringPromise(xml, {
        tagNameProcessors: [(tag) => {
                const str = tag.replace(prefixMatch, '');
                const secondLetter = str.charAt(1);
                if (secondLetter && secondLetter.toUpperCase() !== secondLetter) {
                    return str.charAt(0).toLowerCase() + str.slice(1);
                }
                return str;
            }],
    });
    if (!result || !result.envelope || !result.envelope.body) {
        throw new Error('Wrong ONVIF SOAP response');
    }
    if (result.envelope.body[0].fault) {
        const fault = result.envelope.body[0].fault[0];
        let reason;
        try {
            if (fault.reason[0].text[0]._) {
                reason = fault.reason[0].text[0]._;
            }
        }
        catch (e) {
            reason = '';
        }
        if (!reason) {
            try {
                reason = JSON.stringify(linerase(fault.code[0]));
            }
            catch (e) {
                reason = '';
            }
        }
        let detail;
        try {
            [detail] = fault.detail[0].text;
        }
        catch (e) {
            detail = '';
        }
        // console.error('Fault:', reason, detail);
        throw new Error(`ONVIF SOAP Fault: ${reason}${detail} ${rawXml}`);
    }
    return [result.envelope.body, xml];
}
exports.parseSOAPString = parseSOAPString;
//# sourceMappingURL=utils.js.map