export default updateModel;
declare namespace updateModel {
    export { updateOne };
    export { updateMany };
    export { updateById };
    export { updateOneBy };
    export { updateManyBy };
    export { updateByQuery };
    export { findOneAndUpdate };
    export { findManyAndUpdate };
}
declare function updateOne(query?: {}, updateObj?: {}, projection?: {}, options?: {}): Promise<any>;
declare function updateMany(query?: {}, updateObj?: {}, projection?: {}, options?: {}): Promise<any>;
declare function updateById(id: any, updateObj?: {}, projection?: {}, options?: {}): Promise<any>;
declare function updateOneBy(key: string, value: any, updateObj?: {}, projection?: {}, options?: {}): Promise<any>;
declare function updateManyBy(key: string, value: any, updateObj?: {}, projection?: {}, options?: {}): Promise<any>;
declare function updateByQuery(esBody?: {}, options?: {}): Promise<any>;
declare function findOneAndUpdate(query?: {}, updateObj?: {}, projection?: {}, options?: {}): Promise<any>;
declare function findManyAndUpdate(query?: {}, updateObj?: {}, projection?: {}, options?: {}): Promise<{
    items: any[];
    errors: any[];
    hasError: boolean;
}>;
