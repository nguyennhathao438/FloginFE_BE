docker pull grafana/k6
docker run --rm -i grafana/k6 run - <test.js

docker run --rm -v ${PWD}\k6:/scripts grafana/k6 run /scripts/Login.js
docker run --rm -v ${PWD}\k6:/scripts grafana/k6 run /scripts/ProductTest.js
