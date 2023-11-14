export type ParseSOAPStringCallback = () => any;
/**
 * Parse SOAP object to pretty JS-object
 * @param {object} xml
 * @returns {object}
 */
export function linerase(xml: object): object;
/**
 * @callback ParseSOAPStringCallback
 * @property {?Error} error
 * @property {object} SOAP response
 * @property {string} raw XML
 * @property {number} HTTP Status Code
 */
/**
 * Parse SOAP response
 * @param {string} xml
 * @param {ParseSOAPStringCallback} callback
 * @param {number} statusCode. This is passed in so it can be passed back out to the callback
 */
export function parseSOAPString(xml: string, callback: ParseSOAPStringCallback, statusCode: any): void;
/**
 * Generate GUID
 * @returns {string}
 */
export function guid(): string;
