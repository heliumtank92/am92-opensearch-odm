export default clientManager;
declare namespace clientManager {
    export { connect };
    export { createClient };
    export { releaseClient };
    export { getPersistentClient };
}
declare function connect(): Promise<void>;
declare function createClient(connectionConfig?: {
    node: string;
    ssl: {
        rejectUnauthorized: boolean;
    };
}): Promise<Client>;
declare function releaseClient(client: any): void;
declare function getPersistentClient(): any;
import { Client } from '@opensearch-project/opensearch';
