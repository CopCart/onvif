/**
 * Parse SOAP object to pretty JS-object
 */
export declare function linerase(xml: any): any;
/**
 * Generate GUID
 * @returns {string}
 */
export declare function guid(): string;
export declare type CamResponse = Promise<[Record<string, any>, string]>;
/**
 * Parse SOAP response
 */
export declare function parseSOAPString(rawXml: string): CamResponse;
