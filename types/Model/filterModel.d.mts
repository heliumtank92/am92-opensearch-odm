export default filterModel;
declare namespace filterModel {
    export { findOne };
    export { findMany };
    export { findById };
    export { findOneBy };
    export { findManyBy };
    export { list };
    export { search };
    export { findByDateRange };
    export { findByDate };
}
declare function findOne(query?: {}, projection?: {}, options?: {}): Promise<any>;
declare function findMany(query?: {}, projection?: {}, options?: {}): Promise<any>;
declare function findById(id: any, projection?: {}, options?: {}): Promise<any>;
declare function findOneBy(key: string, value: any, projection?: {}, options?: {}): Promise<any>;
declare function findManyBy(key: string, value: any, projection?: {}, options?: {}): Promise<any>;
declare function list(projection?: {}, options?: {}): Promise<any>;
declare function search(esBody?: {}, projection?: {}, options?: {}): Promise<any>;
declare function findByDateRange(startDate: any, endDate: any, projection?: {}, options?: {}): Promise<any>;
declare function findByDate(date: any, projection?: {}, options?: {}): Promise<any>;
