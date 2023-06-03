# banking-account

## To run in local

### To run the db in local loaclhost:8001
docker-compose up

### To start the server:
npm i
yarn install
yarn local

### to start unit tests with coverage: 
yarn test

### the endpoint are available at localhost:3000
POST /account/{accountId}/deposit
POST /account/{accountId}/withdrawal
GET /account/{accountId}/operations

### A default accountId exists with the following id:
"account"

### A json file containing the endpoints for POSTMAN can be found here
/postman-collection.json


