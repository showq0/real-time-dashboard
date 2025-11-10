**Real-Time Analytics Dashboard**

- **Reason for choosing:** : Chose to build a system capable of handling high-throughput data streams from multiple sources, efficiently managing CPU-intensive data aggregation and I/O-heavy tasks like storing historical data, to provide real-time analytics—a common real-world backend challenge.

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
