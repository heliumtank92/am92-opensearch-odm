export default CONFIG;
declare namespace CONFIG {
    export { CONNECTION_CONFIG };
}
export const SERVICE: string;
declare namespace CONNECTION_CONFIG {
    export { node };
    export namespace ssl {
        const rejectUnauthorized: boolean;
    }
}
declare const node: string;
