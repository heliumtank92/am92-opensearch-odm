export default createModel;
declare namespace createModel {
    export { createOne };
    export { createMany };
}
declare function createOne(attrs?: {}): Promise<any>;
declare function createMany(attrs?: any[]): Promise<{
    items: any[];
    errors: any[];
    hasError: boolean;
}>;
