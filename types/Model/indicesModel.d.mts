export default indicesModel;
declare namespace indicesModel {
    export { createIndices };
    export { removeIndices };
    export { indicesExists };
    export { updateSchema };
    export { updateSettings };
}
declare function createIndices(): Promise<void>;
declare function removeIndices(): Promise<void>;
declare function indicesExists(): Promise<{
    indicesExist: boolean;
}>;
declare function updateSchema(): Promise<void>;
declare function updateSettings(): Promise<void>;
