export default modelHelper;
declare namespace modelHelper {
    export { buildIndicesParams };
    export { buildProjections };
    export { extractSourceFromSearchResponse };
    export { validateDate };
}
declare function buildIndicesParams(Schema: any, action?: string): {};
declare function buildProjections(projection: any): {
    _source_includes: any[];
    _source_excludes: any[];
};
declare function extractSourceFromSearchResponse(response: any, returnType: any): any;
declare function validateDate(date?: string): any;
