const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const Redis = require('ioredis');

const redis = new Redis();

const PROTO_PATH = './metrics.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const metricsProto = grpc.loadPackageDefinition(packageDefinition).metrics;
function biDiStream(call) {
  call.on('data', async (metric) => {
    console.log(`Received: CPU=${metric.cpu.toFixed(2)}, Memory=${metric.memory.toFixed(2)}, Time=${metric.time.seconds}`);

    //added to stream metrics-raw
    await redis.xadd('metrics-raw', '*', 
      'client_id', metric.client_id,
      'cpu', metric.cpu,
      'memory', metric.memory,
      'time', metric.time.seconds
    );

    call.write({ status: 'OK', message: 'Metric received' });
  });

  call.on('end', () => {
    console.log('Client ended the stream');
    call.end();
  });
}


const grpcServer = new grpc.Server();
grpcServer.addService(metricsProto.MetricsService.service, { BiDiStream: biDiStream });
grpcServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC server running on port 50051');
  grpcServer.start();
});
