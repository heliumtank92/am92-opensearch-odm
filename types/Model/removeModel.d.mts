export default removeModel;
declare namespace removeModel {
    export { remove };
    export { removeById };
}
declare function remove(query?: {}, options?: {}): Promise<{
    items: any[];
    errors: any[];
    hasError: boolean;
}>;
declare function removeById(id: any, options?: {}): Promise<void>;
