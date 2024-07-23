export default indicesModel;
declare namespace indicesModel {
    export { createIndices };
    export { removeIndices };
    export { indicesExists };
    export { updateSchema };
    export { updateSettings };
    export { closeIndices };
    export { openIndices };
}
declare function createIndices(): Promise<void>;
declare function removeIndices(): Promise<void>;
declare function indicesExists(): Promise<{
    indicesExist: boolean;
}>;
declare function updateSchema(): Promise<void>;
declare function updateSettings(): Promise<void>;
declare function closeIndices(): Promise<void>;
declare function openIndices(): Promise<void>;
