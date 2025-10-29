import http from 'k6/http';

const INGEST_URL = 'http://localhost:3000/ingest';

export const options = {
  scenarios: {
    load: {
      executor: 'constant-arrival-rate',
      rate: 10000,    
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 10000,
    },
    },
    // threshoulds: {
    //   http_req_failed: ["rate<0.01"] 
    // }
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
