import { APIGatewayProxyEvent } from 'aws-lambda';
import { postOperationController } from '../controllers/postOperationController';

exports.main = async (request: APIGatewayProxyEvent) => {
  return await postOperationController(request, 'WITHDRAWAL');
};
