**Real-Time Analytics Dashboard**

- **Reason for choosing:** : 
The Real-Time Analytics Dashboard scenario is challenging because aggregating data from thousands of servers generates high CPU load, involves I/O-intensive tasks like storing historical data, and also requires designing the system to provide real-time updates

## system architecture diagram
### APPROACH1
[image1]<img width="783" height="483" alt="image" src="https://github.com/user-attachments/assets/9baf99b3-77c2-4e5f-984a-489f6c6b84c2" />


### APPROACH2
[image2]<img width="688" height="231" alt="Screenshot 2025-12-03 at 12 56 28 AM" src="https://github.com/user-attachments/assets/ac73b23a-eec2-428f-9226-f0d125d6e730" />


---
## Tech Stack
- **Backend:** Node.js (Express)
- **Database / Storage:** PostgreSQL, Redis
- **Containerization:** Docker, Docker Compose
- **Load Balancer / Proxy:** Envoy

### APPROACH1
- **Protocol:** HTTP/1.1
- **Load Testing:** k6
- 
### APPROACH2
- **Protocol:** gRPC, HTTP/2
- **Message Queue / Streaming:**:bidirectional streaming
- **Load Testing:** ghz
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
