import { redis, pub} from './redis.js'
import pool from './db.js'

// send bath of live metrics every second
// calculate 15-min windowed metrics



let liveBuffer = [];// real time batchs 
let clientWindows = {}; // for historical data


async function consumeStream() {
  let lastId = '0-0';
  while (true) {
    const res = await redis.xread('BLOCK', 1000, 'STREAMS', 'metrics-raw', lastId);// get the new input metrix that stored in redis
    if (!res) continue;
    const [[, entries]] = res;

    for (const [id, fields] of entries) {
      lastId = id;
      const metric = {
        client_id: fields[1],
        cpu: parseFloat(fields[3]),
        memory: parseFloat(fields[5]),
        time: parseInt(fields[7]),
      };
      liveBuffer.push(metric); // to batch publish live metrics

      if (!clientWindows[metric.client_id]) {
        clientWindows[metric.client_id] = {
          firstMetricTime: metric.time,
          sumCpu: 0,
          sumMemory: 0,
          minCpu: metric.cpu,
          maxCpu: metric.cpu,
          minMemory: metric.memory,
          maxMemory: metric.memory,
          count: 0
        };
      }

      const win = clientWindows[metric.client_id];
      win.sumCpu += metric.cpu;
      win.sumMemory += metric.memory;
      win.count += 1;
      win.minCpu = Math.min(win.minCpu, metric.cpu);
      win.maxCpu = Math.max(win.maxCpu, metric.cpu);
      win.minMemory = Math.min(win.minMemory, metric.memory);
      win.maxMemory = Math.max(win.maxMemory, metric.memory);

      
    if (metric.time - win.firstMetricTime >= 15 * 60) {
      const row = {
        client_id: metric.client_id,
        window_start: new Date(win.firstMetricTime * 1000),
        cpu_avg: win.sumCpu / win.count,
        cpu_min: win.minCpu,
        cpu_max: win.maxCpu,
        memory_avg: win.sumMemory / win.count,
        memory_min: win.minMemory,
        memory_max: win.maxMemory,
      };
    
      pool.query(
        'INSERT INTO historical_metric (client_id, window_start, cpu_avg, cpu_max, cpu_min, memory_avg, memory_max, memory_min) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [row.client_id,row.window_start,row.cpu_avg,row.cpu_max,row.cpu_min,row.memory_avg,row.memory_max,row.memory_min]
      ).catch(console.error);
    
      // Reset for the next window
      clientWindows[metric.client_id] = {
        firstMetricTime: metric.time,
        sumCpu: 0,
        sumMemory: 0,
        minCpu: metric.cpu,
        maxCpu: 0,
        minMemory: metric.memory,
        maxMemory: 0,
        count: 0
      };
    }
    }
  }
}

setInterval(()=>{
  if(liveBuffer.length>0){
    pub.publish('metrics-live', JSON.stringify(liveBuffer));// send batch of live metrics
    liveBuffer = [];// empty buffer to accept new metrics
  }
},1000);// each second

//async function and handling errors
consumeStream().catch(console.error);
