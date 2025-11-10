**Real-Time Analytics Dashboard**

- **Reason for choosing:** : 
The Real-Time Analytics Dashboard scenario is challenging because aggregating data from thousands of servers generates high CPU load, involves I/O-intensive tasks like storing historical data, and also requires designing the system to provide real-time updates


---

## Tech Stack

- **Backend:** Node.js (Express)
- **Protocol:** gRPC, HTTP/1.1, HTTP/2
- **Message Queue / Streaming:** WebSocket bidirectional streaming
- **Database / Storage:** PostgreSQL, Redis
- **Load Balancer / Proxy:** Envoy
- **Containerization:** Docker, Docker Compose
- **Load Testing:** k6
- **Other Tools:** Prometheus/Grafana (for optional monitoring)

---

## Setup Instructions

```bash
git clone <repo-url>
cd your-name-backend-project


```

Create a .env file then

```bash
 docker-compose -f docker-compose2.yml up

 docker-compose -f docker-compose1.yml up

```

## to test implementaion 1

```bash
brew install k6
cd test
k6 run loadtest1.js
```

## to test implementaion 2

install ghz

```bash
cd test

for c in 1000 5000 10000 10000; do
  echo "Running with concurrency=$c ..."
  ghz --insecure \
      --proto ./metrics.proto \
      --call metrics.MetricsService.BiDiStream \
      --data-file requests.json \
      -n 3000 \
      -c $c \
      localhost:50051
done
```
