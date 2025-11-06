import express from 'express';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let aggregatedMetrics = {};
let clients = [];

// aggregate metrics
function aggregateMetrics(metric) {
  const { server_id, cpu, memory } = metric;
  const now = Date.now();
  //create record
  if (!aggregatedMetrics[server_id]) {
    aggregatedMetrics[server_id] = {
      startTime: now,
      cpuSum: 0,
      memorySum: 0,
      count: 0,
      min_cpu: cpu,
      max_cpu: cpu,
      min_memory: memory,
      max_memory: memory,
    };
  }

  const prev = aggregatedMetrics[server_id];
  prev.cpuSum += cpu;
  prev.memorySum += memory;
  prev.count += 1;
  prev.min_cpu = Math.min(prev.min_cpu, cpu);
  prev.max_cpu = Math.max(prev.max_cpu, cpu);
  prev.min_memory = Math.min(prev.min_memory, memory);
  prev.max_memory = Math.max(prev.max_memory, memory);

  // historical data sotre every 15 min
  const fifteenMin = 1 * 60 * 1000;
  if (now - prev.startTime >= fifteenMin) {
    const avg_cpu = prev.cpuSum / prev.count;
    const avg_memory = prev.memorySum / prev.count;

    const result = {
      server_id,
      avg_cpu,
      min_cpu: prev.min_cpu,
      max_cpu: prev.max_cpu,
      avg_memory,
      min_memory: prev.min_memory,
      max_memory: prev.max_memory,
      count: prev.count,
    };

    // reset window
    aggregatedMetrics[server_id] = null;
    delete aggregatedMetrics[server_id];
    return result;
  }

  return null; // no data to store
}

// POST endpoint to ingest metrics
app.post('/ingest',(req, res) => {
  const metrics = req.body;
  // broadcast non-blocking.
  clients.forEach(client => client.res.write(`data: ${JSON.stringify(metrics)}\n\n`));

  const aggregated = aggregateMetrics(metrics);
  // i/o non-blocking
  if (aggregated) {
      try {
          pool.query(
          `INSERT INTO server_metrics 
           (server_id, avg_cpu, min_cpu, max_cpu, avg_memory, min_memory, max_memory, count, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
          [
            aggregated.server_id,
            aggregated.avg_cpu,
            aggregated.min_cpu,
            aggregated.max_cpu,
            aggregated.avg_memory,
            aggregated.min_memory,
            aggregated.max_memory,
            aggregated.count,
          ]
        );
      } catch (err) {
        console.error(
          'DB insert error for server ' +  metrics.server_id + ': ' + err.message
        );
      }
    }
    
  res.status(200).send({ message: 'Metrics received'  ,process: `${process.pid}`});
});

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // strea cpu , memroy ,avg memory, avg cpu 
  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);

  Object.values(aggregatedMetrics).forEach(metric => {
    res.write(`data: ${JSON.stringify(metric)}\n\n`);
  });

  req.on('close', () => {
    clients = clients.filter(c => c.id !== clientId);
  });
});

app.listen(PORT, () => console.log(`[Worker ${PORT}] Server running`))

