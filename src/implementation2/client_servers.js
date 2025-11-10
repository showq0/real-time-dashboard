// for test

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './metrics.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const metricsProto = grpc.loadPackageDefinition(packageDefinition).metrics;
const client = new metricsProto.MetricsService('localhost:50051', grpc.credentials.createInsecure());

const call = client.BiDiStream();

call.on('data', (response) => {
  console.log('Server response:', response);
});

call.on('end', () => {
  console.log('Server ended the stream');
});

setInterval(() => {
  const now = new Date();
  call.write({
    client_id: 'client-3',
    cpu: Math.random() * 100,
    memory: Math.random() * 16,
    time: { seconds: Math.floor(now.getTime() / 1000), nanos: 0 }
  });
}, 1000);
