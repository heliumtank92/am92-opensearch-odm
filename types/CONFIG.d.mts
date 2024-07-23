export default CONFIG;
declare namespace CONFIG {
    export { CONNECTION_CONFIG };
    export { OPENSEARCH_INDEX_PREFIX as INDEX_PREFIX };
}
export const SERVICE: string;
declare namespace CONNECTION_CONFIG {
    export { node };
    export namespace ssl {
        const rejectUnauthorized: boolean;
    }
}
declare const OPENSEARCH_INDEX_PREFIX: string;
declare const node: string;
