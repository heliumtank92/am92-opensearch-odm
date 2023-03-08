export default utils;
declare namespace utils {
    export { flattenObj };
    export { flattenArray };
    export { unflattenObj };
    export { mergeObjs };
    export { sanitizeString };
    export { sanitizeObj };
    export { sanitizeValue };
    export { chunkString };
}
declare function flattenObj(obj: any, options?: {}): {};
declare function flattenArray(array?: any[], options?: {}): {};
declare function unflattenObj(flatObj: any): {};
declare function mergeObjs(...args: any[]): {};
declare function sanitizeString(str?: string): string;
declare function sanitizeObj(obj: any): {};
declare function sanitizeValue(value: any): any;
declare function chunkString(str: any, length: any): any;
