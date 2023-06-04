import { APIGatewayProxyEvent } from "aws-lambda";
import { postDepositValidator } from "../../../../src/apps/helpers/validators/postDepositValidator";

describe('Post Operation Validator', () => {

  describe('postDepositValidator', () => {

    it('validate and return input', async () => {

        const expectedInput = {
            amount: 300,
            accountId: 'account'
        }

        const request = {
            body: JSON.stringify({amount: 300}),
            pathParameters: {accountId: 'account'}
        } as unknown as APIGatewayProxyEvent;

        const input = await postDepositValidator(request);

        expect(input).toStrictEqual(expectedInput)
    });

    it('throw error on no body', async () => {

        const request = {
            pathParameters: {accountId: 'account'}
          } as unknown as APIGatewayProxyEvent;
    
          const expectedError = new Error('Missing body'); 
    
          await expect(async () => {
            await postDepositValidator(request);
          }).rejects.toThrow(expectedError);
    });
});
});