**Real-Time Analytics Dashboard**

- **Reason for choosing:** : 
The Real-Time Analytics Dashboard scenario is challenging because aggregating data from thousands of servers generates high CPU load, involves I/O-intensive tasks like storing historical data, and also requires designing the system to provide real-time updates


---

## Tech Stack

- **Backend:** Node.js (Express)
- **Protocol:** gRPC, HTTP/1.1, HTTP/2
- **Message Queue / Streaming:**: bidirectional streaming
- **Database / Storage:** PostgreSQL, Redis
- **Load Balancer / Proxy:** Envoy
- **Containerization:** Docker, Docker Compose
- **Load Testing:** k6, ghz
- **Other Tools:** Prometheus/Grafana (for optional monitoring)

---

## Setup Instructions

```bash
git clone https://github.com/showq0/real-time-dashboard.git
cd real-time-dashboard


```

Create a .env file 
### Apply Docker image 
for implementaion1

```bash
 docker-compose -f docker-compose2.yml build 

 docker-compose -f docker-compose2.yml up
```
for implementaion2

```bash
 docker-compose -f docker-compose2.ym2 build 

 docker-compose -f docker-compose1.yml up

```

## Load test implementation 1

```bash
brew install k6
cd test
k6 run loadtest1.js
```

## Load test implementation 2

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
