export default class Schema {
    constructor(index?: string, properties?: {}, settings?: {}, aliases?: any[], options?: {});
    index: any;
    properties: any;
    settings: any;
    aliases: any[];
    options: any;
    propsArray: string[];
    instantiate(attrs?: {}, type?: string): {
        id: any;
        createdAt: string;
        updatedAt: string;
    };
}
