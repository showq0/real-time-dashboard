import axios from 'axios';
// setInterval->  do function each 1000 milliseconds
// Fire-and-Forget
setInterval(() => {
    const metrics = { server_id: 1, cpu: Math.random() * 100, memory: Math.random() * 100 };

    axios.post('http://localhost:3000/ingest', metrics)
    .then(res => console.log('Metrics sent:', res.data))
    .catch(err => console.error('Failed to send metrics', err.message));
}, 1000);

