```bash
npm i @instance-oom/node-zookeeper-client-async
```

```ts
const zookeeper = require('@instance-oom/node-zookeeper-client-async');

const main = async () => {
  const client = zookeeper.createClient('127.0.0.1:2181');
  await client.connectAsync();

  const exists = await client.existsAsync(nodePath);
  console.log('exists', exists?.ctime?.toString('hex'));

  const { data, stat } = await client.getDataAsync(nodePath);
  console.log('getDataAsync', data.toString(), stat);

  await client.setDataAsync(nodePath, Buffer.from('xxx'));
}
main();
```
