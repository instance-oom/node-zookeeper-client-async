/// <reference types="node" />
import { EventEmitter } from "events";

declare module 'node-zookeeper-client' {

  export const Permission: {
    READ: number;
    WRITE: number;
    CREATE: number;
    DELETE: number;
    ADMIN: number;
    ALL: number;
  }

  export const CreateMode: {
    PERSISTENT: number;
    PERSISTENT_SEQUENTIAL: number;
    EPHEMERAL: number;
    EPHEMERAL_SEQUENTIAL: number;
  }

  export class Id {

    static ANYONE_ID_UNSAFE: Id
    static AUTH_IDS: Id

    schema: string;
    id: string;

    constructor(scheme: string, id: string);

    fromRecord(record: any): Id
  }

  export class ACL {

    static OPEN_ACL_UNSAFE: ACL[]
    static CREATOR_ALL_ACL: ACL[]
    static READ_ACL_UNSAFE: ACL[]

    permission: number;
    id: Id;

    constructor(permission: number, id: Id);

    fromRecord(record: any): ACL
  }

  export class State {
    static DISCONNECTED: State;
    static SYNC_CONNECTED: State;
    static AUTH_FAILED: State;
    static CONNECTED_READ_ONLY: State;
    static SASL_AUTHENTICATED: State;
    static EXPIRED: State;

    name: string;
    code: number;

    constructor(name: string, code: number);

    getName(): string;
    getCode(): number;
    toString(): string;
  }

  export class Event {
    static NODE_CREATED: number;
    static NODE_DELETED: number;
    static NODE_DATA_CHANGED: number;
    static NODE_CHILDREN_CHANGED: number;

    type: number;
    name: string;
    path: string;

    constructor(type: number, name: string, path: string);
    create(watcherEvent: { type: any, path: any }): Event;
    getType(): string;
    getName(): string;
    getPath(): string;
    toString(): string;
  }

  export class Exception {
    static OK: number;
    static SYSTEM_ERROR: number;
    static RUNTIME_INCONSISTENCY: number;
    static DATA_INCONSISTENCY: number;
    static CONNECTION_LOSS: number;
    static MARSHALLING_ERROR: number;
    static UNIMPLEMENTED: number;
    static OPERATION_TIMEOUT: number;
    static BAD_ARGUMENTS: number;
    static API_ERROR: number;
    static NO_NODE: number;
    static NO_AUTH: number;
    static BAD_VERSION: number;
    static NO_CHILDREN_FOR_EPHEMERALS: number;
    static NODE_EXISTS: number;
    static NOT_EMPTY: number;
    static SESSION_EXPIRED: number;
    static INVALID_CALLBACK: number;
    static INVALID_ACL: number;
    static AUTH_FAILED: number;

    code: number;
    name: string;
    path?: string;

    constructor(code: number, name: string, ctor: Function);
    constructor(code: number, name: string, path: string, ctor: Function);

    create(code: number, path: string): Exception;
    getCode(): number;
    getName(): number;
    getPath(): string;
    toString(): string;
  }

  export interface Stat {
    czxid: number;
    mzxid: number;
    ctime: number;
    mtime: number;
    version: number;
    cversion: number;
    aversion: number;
    ephemeralOwner: number;
    dataLength: number;
    numChildren: number;
    pzxid: number;
  }

  export interface Transaction {
    create(path: string, dataOrAclsOrmode1?: Buffer | ACL[] | number, dataOrAclsOrmode2?: Buffer | ACL[] | number, dataOrAclsOrmode3?: Buffer | ACL[] | number): this;
    setData(path: string, data: Buffer | null, version?: number): this;
    check(path: string, version?: number): this;
    remove(path: string, version?: number): this;
    commit(callback: (error: Error | Exception, results: any) => void): void;
  }

  export interface ClientOption {
    sessionTimeout: number
    spinDelay: number
    retries: number
  }

  export interface Client extends EventEmitter {
    connect(): void;
    close(): void;
    getState(): State;
    getSessionId(): Buffer;
    getSessionPassword(): Buffer;
    getSessionTimeout(): number;
    addAuthInfo(scheme: string, auth: Buffer): void;

    create(path: string, callback: (error: Error | Exception, path: string) => void): void;
    create(path: string, dataOrAclsOrmode1: Buffer | ACL[] | number, callback: (error: Error | Exception, path: string) => void): void;
    create(path: string, dataOrAclsOrmode1: Buffer | ACL[] | number, dataOrAclsOrmode2: Buffer | ACL[] | number, callback: (error: Error | Exception, path: string) => void): void;
    create(path: string, dataOrAclsOrmode1: Buffer | ACL[] | number, dataOrAclsOrmode2: Buffer | ACL[] | number, dataOrAclsOrmode3: Buffer | ACL[] | number, callback: (error: Error | Exception, path: string) => void): void;

    remove(path: string, callback: (error: Error | Exception) => void): void;
    remove(path: string, version: number, callback: (error: Error | Exception) => void): void;

    removeRecursive(path: string, callback: (error: Error | Exception) => void): void;
    removeRecursive(path: string, version: number, callback: (error: Error | Exception) => void): void;

    setData(path: string, data: Buffer | null, callback: (error: Error | Exception, stat: Stat) => void): void;
    setData(path: string, data: Buffer | null, version: number, callback: (error: Error | Exception, stat: Stat) => void): void;

    getData(path: string, callback: (error: Error | Exception, data: Buffer, stat: Stat) => void): void;
    getData(path: string, watcher: (event: Event) => void, callback: (error: Error | Exception, data: Buffer, stat: Stat) => void): void;

    setACL(path: string, acls: ACL[], callback: (error: Error | Exception, stat: Stat) => void): void;
    setACL(path: string, acls: ACL[], version: number, callback: (error: Error | Exception, stat: Stat) => void): void;

    getACL(path: string, callback: (error: Error | Exception, acls: ACL[], stat: Stat) => void): void;

    exists(path: string, callback: (error: Error | Exception, stat: Stat) => void): void;
    exists(path: string, watcher: (event: Event) => void, callback: (error: Error | Exception, stat: Stat) => void): void;

    getChildren(path: string, callback: (error: Error | Exception, children: string[], stat: Stat) => void): void;
    getChildren(path: string, watcher: (event: Event) => void, callback: (error: Error | Exception, children: string[], stat: Stat) => void): void;

    listSubTreeBFS(path: string, callback: (error: Error | Exception, children: string[]) => void): void;

    mkdirp(path: string, callback: (error: Error | Exception, path: string) => void): void;
    mkdirp(path: string, dataOrAclsOrmode1: Buffer | ACL[] | number, callback: (error: Error | Exception, path: string) => void): void;
    mkdirp(path: string, dataOrAclsOrmode1: Buffer | ACL[] | number, dataOrAclsOrmode2: Buffer | ACL[] | number, callback: (error: Error | Exception, path: string) => void): void;
    mkdirp(path: string, dataOrAclsOrmode1: Buffer | ACL[] | number, dataOrAclsOrmode2: Buffer | ACL[] | number, dataOrAclsOrmode3: Buffer | ACL[] | number, callback: (error: Error | Exception, path: string) => void): void;

    transaction(): Transaction;

    on(event: "state", cb: (state: State) => void): this;
    on(event: "connected" | "connectedReadOnly" | "disconnected" | "expired" | "authenticationFailed" | string, cb: () => void): this;

    once(event: "state", cb: (state: State) => void): this;
    once(event: "connected" | "connectedReadOnly" | "disconnected" | "expired" | "authenticationFailed" | string, cb: () => void): this;

    addListener(event: "state", cb: (state: State) => void): this;
    addListener(event: "connected" | "connectedReadOnly" | "disconnected" | "expired" | "authenticationFailed" | string, cb: () => void): this;
  }

  export function createClient(connectionString: string, options?: Partial<ClientOption>): Client;
}