export default class OpensearchError extends Error {
    constructor(e: {}, eMap: any);
    _isCustomError: boolean;
    _isOpensearchError: boolean;
    service: string;
    message: any;
    statusCode: any;
    errorCode: any;
    error: {};
}
