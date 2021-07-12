import { Request, Response } from 'express';
import StorageConfiguration from '../configuration/StorageConfiguration';
import AccountController from './AccountController';

describe("AccountController Tests", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject = {};

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            statusCode: 0,
            send: jest.fn().mockImplementation(result => {
                responseObject = result;
            })
        }
    });

    test('200 - users', async () => {
        const sequelize = await StorageConfiguration.initialize("mysql", "test");
        const accountController = new AccountController(sequelize);
    
        const expectedStatusCode = 200;
        const expectedResponse = {
            account: [
                {
                    name: "byoungju94",
                    age: 30
                },
                {
                    name: 'Peter',
                    age: 30
                }
            ]
        };        

        accountController.get(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.statusCode).toBe(expectedStatusCode);
        expect(responseObject).toEqual(expectedResponse);
    });
});