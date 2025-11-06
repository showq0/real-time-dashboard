import { spawn } from 'node:child_process';

const ports = [3001, 3002];

ports.forEach(port => {
  const worker = spawn('node', ['index.js'], {
    env: { ...process.env, PORT: port },
    stdio: 'inherit'
  });

  worker.on('exit', (code) => {
    console.log(`[Worker ${port}] Exited with code ${code}, restarting...`);
    spawn('node', ['implementation1/index.js'], {
      env: { ...process.env, PORT: port },
      stdio: 'inherit'
    });
  });
});
