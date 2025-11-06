import express from 'express';
import cors from 'cors';
import {sub} from './redis.js'

const app = express();
const PORT = 3000;

app.use(cors());
let clients = [];

app.get('/events', (req,res)=>{
  res.setHeader('Content-Type','text/event-stream');
  res.setHeader('Cache-Control','no-cache');
  res.setHeader('Connection','keep-alive');
  res.flushHeaders();

  const client = { id: Date.now(), res };
  clients.push(client);

  const keepAlive = setInterval(()=>res.write(': keep-alive\n\n'),15000);

  req.on('close',()=>{
    clearInterval(keepAlive);
    clients = clients.filter(c=>c.id!==client.id);
  });
});



// stream for live metrics
sub.subscribe('metrics-live', (err)=>{
  if(err) console.error(err);
});

//publish message -> callback runs.
sub.on('message',(channel,message)=>{
  const metrics = JSON.parse(message);
  clients.forEach(c=>c.res.write(`data: ${JSON.stringify(metrics)}\n\n`)); //prodcasting 
});

app.get('/dashboard', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Metrics Dashboard</title>
<style>
body { font-family: Arial; margin: 20px; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ddd; padding: 6px; }
th { background: #f4f4f4; }
</style>
</head>
<body>
<h1>Live Metrics Dashboard</h1>
<table id="metricsTable">
<thead><tr><th>Client</th><th>CPU</th><th>Memory</th><th>Time</th></tr></thead>
<tbody></tbody>
</table>

<script>
const evtSource = new EventSource('/events');
const tbody = document.querySelector('#metricsTable tbody');

evtSource.onmessage = (event) => {
  const metrics = JSON.parse(event.data);
  metrics.forEach(metric => {
    const row = document.createElement('tr');
    row.innerHTML =
      \`<td>\${metric.client_id}</td>\` +
      \`<td>\${metric.cpu.toFixed(2)}</td>\` +
      \`<td>\${metric.memory.toFixed(2)}</td>\` +
      \`<td>\${new Date(metric.time * 1000).toLocaleTimeString()}</td>\`;
    tbody.prepend(row);
  });
  while (tbody.childElementCount > 100) tbody.removeChild(tbody.lastChild);
};
</script>
</body>
</html>
  `);
});

app.listen(PORT, ()=>console.log(`SSE Gateway running at http://localhost:${PORT}/dashboard`));

