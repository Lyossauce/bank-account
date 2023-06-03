import { APIGatewayProxyEvent } from 'aws-lambda';

export const postDepositController = (request: APIGatewayProxyEvent) => {
  console.log('hello');
};
