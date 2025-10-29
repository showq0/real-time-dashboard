// dashboard.js (ES module)
const eventSource = new EventSource('http://localhost:3000/stream');

eventSource.onmessage = (event) => {
  const metrics = JSON.parse(event.data);
  console.log('New metrics received:', metrics);
};

eventSource.onerror = (err) => {
  console.error('SSE error:', err);
};
