import http from 'k6/http';
import { sleep } from 'k6';

const INGEST_URL = 'http://worker1:3001/ingest';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-vus',
      vus: 10000,
      duration: '300s',
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
  sleep(1);
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