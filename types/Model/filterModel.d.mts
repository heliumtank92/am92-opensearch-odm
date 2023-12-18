export default filterModel;
declare namespace filterModel {
    export { findOne };
    export { findMany };
    export { findById };
    export { findByIds };
    export { findOneBy };
    export { findManyBy };
    export { list };
    export { findByGeoDistance };
    export { search };
    export { findByDateRange };
    export { findByDate };
}
declare function findOne(query?: {}, projection?: {}, options?: {}): Promise<any>;
declare function findMany(query?: {}, projection?: {}, options?: {}): Promise<any>;
declare function findById(id: any, projection?: {}): Promise<any>;
declare function findByIds(ids?: any[], projection?: {}, options?: {}): Promise<any>;
declare function findOneBy(key: string, value: any, projection?: {}, options?: {}): Promise<any>;
declare function findManyBy(key: string, value: any, projection?: {}, options?: {}): Promise<any>;
declare function list(projection?: {}, options?: {}): Promise<any>;
declare function findByGeoDistance(attrs?: {}, projection?: {}, options?: {}): Promise<any>;
declare function search(esBody?: {}, projection?: {}, options?: {}): Promise<any>;
declare function findByDateRange(startDate: any, endDate: any, projection?: {}, options?: {}): Promise<any>;
declare function findByDate(date: any, projection?: {}, options?: {}): Promise<any>;
