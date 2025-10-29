import axios from "axios";
import fs from "fs";

const SERVER_COUNT = 10000; // number of simulated servers
const INTERVAL_MS = 1000; // each sends metrics every 1 second
const INGEST_URL = "http://localhost:3000/ingest"; // your Node.js endpoint

const results = [];


async function startServerSimulation(serverId) {
  const metrics = { server_id: serverId, cpu: Math.random() * 100, memory: Math.random() * 100 };
  const start = Date.now();

  try {
    await axios.post(INGEST_URL, metrics);
    const latency = Date.now() - start;  // measured after response
    results.push({ server_id: serverId, latency_ms: latency, status: "success" });
  } catch (err) {
    const latency = Date.now() - start;
    results.push({ server_id: serverId, latency_ms: latency, status: "error", message: err.message });
  }
}


// Start all simulated servers
const post_promise  = [];
for (let i = 1; i <= SERVER_COUNT; i++) {
  post_promise.push(startServerSimulation(i));
}

Promise.allSettled(post_promise).then(() => {
  fs.writeFileSync("results-latency.json", JSON.stringify(results, null, 2));
  console.log("done");
});
console.log(`Started load test with ${SERVER_COUNT} simulated servers.`);
