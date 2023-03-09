export default indicesModel;
declare namespace indicesModel {
    export { createIndices };
    export { removeIndices };
    export { indicesExists };
}
declare function createIndices(): Promise<void>;
declare function removeIndices(): Promise<void>;
declare function indicesExists(): Promise<{
    indicesExist: boolean;
}>;
