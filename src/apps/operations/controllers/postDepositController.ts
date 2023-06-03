import { APIGatewayProxyEvent } from 'aws-lambda';
import { postDepositValidator } from '../../helpers/validators/postDepositValidator';

export const postDepositController = async (request: APIGatewayProxyEvent) => {
  const input = await postDepositValidator(request);
};
