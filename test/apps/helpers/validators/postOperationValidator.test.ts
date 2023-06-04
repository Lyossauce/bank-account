import { APIGatewayProxyEvent } from "aws-lambda";
import { postOperationValidator } from "../../../../src/apps/helpers/validators/postOperationValidator";

describe('Post Operation Validator', () => {

  describe('postOperationValidator', () => {

    it('validate and return input', async () => {

        const expectedInput = {
            amount: 300,
            accountId: 'account'
        }

        const request = {
            body: JSON.stringify({amount: 300}),
            pathParameters: {accountId: 'account'}
        } as unknown as APIGatewayProxyEvent;

        const input = await postOperationValidator(request);

        expect(input).toStrictEqual(expectedInput)
    });

    it('throw error on no body', async () => {

        const request = {
            pathParameters: {accountId: 'account'}
          } as unknown as APIGatewayProxyEvent;
    
          const expectedError = new Error('Missing body'); 
    
          await expect(async () => {
            await postOperationValidator(request);
          }).rejects.toThrow(expectedError);
    });
});
});