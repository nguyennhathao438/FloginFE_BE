cd backend
docker pull grafana/k6

docker run --rm -v ${PWD}\k6:/scripts grafana/k6 run /scripts/LoginTest.js
docker run --rm -v ${PWD}\k6:/scripts grafana/k6 run /scripts/ProductTest.js
