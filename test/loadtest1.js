import http from 'k6/http';

// const INGEST_URL = 'http://127.0.0.1:3001/ingest';
const INGEST_URL = 'http://worker1:3001/ingest';

export const options = {
  scenarios: {
    ramp_to_10k: {
      executor: 'ramping-arrival-rate',
      startRate: 1000,      
      timeUnit: '1s',
      preAllocatedVUs: 500,
      maxVUs: 1578,
      stages: [
        { target: 1000, duration: '10s' },   // ramp to 1k RPS
        { target: 5000, duration: '10s' },   // ramp to 5k RPS
        { target: 10000, duration: '20s' },  // ramp to 10k RPS
        { target: 10000, duration: '20s' },  // hold 10k RPS
      ],
    },
  },
};
const payload = JSON.stringify({
    server_id: 1,
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
export default function () {
  
  const res = http.post(INGEST_URL, payload, params);

  // Optional: log errors if any
  if (res.status !== 200) {
    console.error(`Request failed: ${res.status}`);
  }
}
// for c in 1000  5000  10000 10000; do
//   echo "Running with concurrency=$c ..."
//   ghz --insecure \
//       --proto ./metrics.proto \
//       --call metrics.MetricsService.BiDiStream \
//       --data-file requests.json \
//       -n 30000 \
//       -c $c \
//       localhost: 50051
// done