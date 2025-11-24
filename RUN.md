# Chạy full test backend

cd backend
mvn test # Chạy 1 file cụ thể
mvn -Dtest=_filename_ test

# Xuất report

    mvn allure:report
    mvn jacoco:report

# Hiện báo cáo

    mvn allure:serve

# Chạy full test unit frontend

    npm run test
    npm run test:coverage
    # in báo cáo
    npx jest --json --outputFile=test-result/test-results.json
