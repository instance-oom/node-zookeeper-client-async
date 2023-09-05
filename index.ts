/// <reference path="./node-zookeeper-client.d.ts" />
import zookeeper, { ACL, Id, Permission, CreateMode, State, Event, Exception, Stat } from 'node-zookeeper-client';

class Client {

  private _connectionString: string;
  private _zkClient: zookeeper.Client;

  constructor(connectionString: string, options?: Partial<zookeeper.ClientOption>) {
    this._connectionString = connectionString;
    this._zkClient = zookeeper.createClient(connectionString, options)
  }

  get connectedServer() {
    let result = '';
    let socket = this._zkClient && (this._zkClient as any).connectionManager && (this._zkClient as any).connectionManager.socket;
    if (socket) result = `${socket.remoteAddress}:${socket.remotePort}`;
    return result;
  }

  /**
   * Connect to zookeeper
   * @param timeout Connect timeout with millisecond
   * @returns {Promise<void>}
   */
  connectAsync(timeout = -1) {
    return new Promise<void>((resolve, reject) => {
      let err = false;
      this._zkClient.once('connected', () => {
        if (!err) resolve();
      });
      this._zkClient.connect();
      if (timeout > 0) {
        setTimeout(() => {
          err = true;
          reject(`Connenct to ${this._connectionString} timeouted`);
        }, timeout);
      }
    });
  }

  /**
   * Close zookeeper connect
   */
  close() {
    this._zkClient.close();
  }

  on(event: 'state', cb: (state: State) => void): Client
  on(event: 'connected' | 'connectedReadOnly' | 'disconnected' | 'expired' | 'authenticationFailed', cb: () => void): Client
  on(event: string, cb: Function) {
    this._zkClient.on(event, cb as any);
    return this;
  };

  once(event: 'state', cb: (state: State) => void): Client
  once(event: 'connected' | 'connectedReadOnly' | 'disconnected' | 'expired' | 'authenticationFailed', cb: () => void): Client
  once(event: string, cb: Function) {
    this._zkClient.once(event, cb as any);
    return this;
  }

  addListener(event: 'state', cb: (state: State) => void): Client
  addListener(event: 'connected' | 'connectedReadOnly' | 'disconnected' | 'expired' | 'authenticationFailed', cb: () => void): Client
  addListener(event: string, cb: Function) {
    this._zkClient.once(event, cb as any);
    return this;
  }

  createAsync(path: string, data: Buffer | undefined = undefined, acls: ACL[] = ACL.OPEN_ACL_UNSAFE, mode = CreateMode.PERSISTENT) {
    return new Promise<string>((resolve, reject) => {
      this._zkClient.create(path, data as Buffer, acls, mode, (err, path) => {
        if (err) return reject(err);
        resolve(path);
      })
    });
  }

  removeAsync(path: string, version: number = -1) {
    return new Promise<void>((resolve, reject) => {
      this._zkClient.remove(path, version, (err) => {
        if (err) return reject(err);
        resolve();
      })
    });
  }

  removeRecursiveAsync(path: string, version: number = -1) {
    return new Promise<void>((resolve, reject) => {
      this._zkClient.removeRecursive(path, version, (err) => {
        if (err) return reject(err);
        resolve();
      })
    });
  }

  setDataAsync(path: string, data: Buffer, version: number = -1) {
    return new Promise<Stat>((resolve, reject) => {
      this._zkClient.setData(path, data, version, (err, stat) => {
        if (err) return reject(err);
        resolve(stat);
      })
    });
  }

  getDataAsync(path: string, watcher?: (event: Event) => void) {
    return new Promise<{ data: Buffer, stat: Stat }>((resolve, reject) => {
      this._zkClient.getData(path, watcher as any, (err, data, stat) => {
        if (err) return reject(err);
        resolve({ data, stat });
      })
    });
  }

  setACLAsync(path: string, acls: ACL[], version: number = -1) {
    return new Promise<Stat>((resolve, reject) => {
      this._zkClient.setACL(path, acls, version, (err, stat) => {
        if (err) return reject(err);
        resolve(stat);
      })
    });
  }

  getACLAsync(path: string) {
    return new Promise<{ acls: ACL[], stat: Stat }>((resolve, reject) => {
      this._zkClient.getACL(path, (err, acls, stat) => {
        if (err) return reject(err);
        resolve({ acls, stat });
      })
    });
  }

  existsAsync(path: string, watcher?: (event: Event) => void) {
    return new Promise<Stat>((resolve, reject) => {
      this._zkClient.exists(path, watcher as any, (err, stat) => {
        if (err) return reject(err);
        resolve(stat);
      })
    });
  }

  getChildrenAsync(path: string) {
    return new Promise<{ children: string[], stat: Stat }>((resolve, reject) => {
      this._zkClient.getChildren(path, (err, children, stat) => {
        if (err) return reject(err);
        resolve({ children, stat });
      })
    });
  }

  listSubTreeBFSAsync(path: string) {
    return new Promise<string[]>((resolve, reject) => {
      this._zkClient.listSubTreeBFS(path, (err, children) => {
        if (err) return reject(err);
        resolve(children);
      })
    });
  }

  mkdirpAsync(path: string, data: Buffer | undefined = undefined, acls: ACL[] = ACL.OPEN_ACL_UNSAFE, mode: number = CreateMode.PERSISTENT) {
    return new Promise<string>((resolve, reject) => {
      this._zkClient.mkdirp(path, data as any, acls, mode, (err, path) => {
        if (err) return reject(err);
        resolve(path);
      })
    });
  }

  transaction() {
    return this._zkClient.transaction();
  }

  addAuthInfo(scheme: string, auth: Buffer) {
    this._zkClient.addAuthInfo(scheme, auth);
  }

  getState(): State {
    return this._zkClient.getState();
  }

  getSessionId(): Buffer {
    return this._zkClient.getSessionId();
  }

  getSessionPassword(): Buffer {
    return this._zkClient.getSessionPassword();
  }

  getSessionTimeout(): number {
    return this._zkClient.getSessionTimeout();
  }
}

/**
 * Create zookeeper client
 * @param connectionString {string}
 * @param options {zookeeper.Option}
 * @returns {Promise<Client>}
 */
const createClient = (connectionString: string, options?: Partial<zookeeper.ClientOption>) => {
  return new Client(connectionString, options);
}

/**
 * Create zookeeper client and wait to connect succeed
 * @param connectionString {string}
 * @param options {zookeeper.Option}
 * @returns {Promise<Client>}
 */
const createClientAsync = async (connectionString: string, options?: Partial<zookeeper.ClientOption>) => {
  const client = new Client(connectionString, options);
  await client.connectAsync();
  return client;
}

export {
  createClient,
  createClientAsync,
  ACL,
  Id,
  Permission,
  CreateMode,
  State,
  Event,
  Exception
}