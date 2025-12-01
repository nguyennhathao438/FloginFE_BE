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

    npx jest src/tests/UnitTest/Login.test.js
    npx jest src/tests/UnitTest/Product.test.js
    npx jest src/tests/UnitTest/ProductForm.test.js
    npx jest src/tests/UnitTest/validation.test.js


    npx jest src/tests/IntegrationTest/Login.integration.test.js
    npx jest src/tests/IntegrationTest/ProductCreate.integration.test.js
    npx jest src/tests/IntegrationTest/ProductList.integration.test.js
    npx jest src/tests/IntegrationTest/ProductUpdate.integration.test.js
    npx jest src/tests/IntegrationTest/ProductView.integration.test.js

    npx jest src/tests/MockTest/Login.mock.test.js
    npx jest src/tests/MockTest/ProductCRUD.mock.test.js
