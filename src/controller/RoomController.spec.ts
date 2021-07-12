import { Request, Response, NextFunction } from 'express';
import StorageConfiguration from '../configuration/StorageConfiguration';
import RoomController from './RoomController';
import { uuid } from 'uuidv4';

describe("RoomControllerTests", () => {
    let roomController: RoomController;

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: Partial<NextFunction>;
    let responseObject = {};

    const newUuid = uuid();

    beforeEach(async () => {
        const sequelize = await StorageConfiguration.initialize("mysql", "test");
        roomController = new RoomController(sequelize);

        mockRequest = {};
        mockResponse = {
            statusCode: 0,
            send: jest.fn().mockImplementation(result => {
                responseObject = result;
            })
        };
    });

    afterAll(() => {
        console.log("test finshed...");
    });

    test('starting new chatting room', async () => {
        const expectedStatusCode = 200;
        const expectedResponse = {
            result: "success"
        }

        mockRequest.body = {
            uuid: `${newUuid}`,
            name: `samsung live testing - ${newUuid}`,
        }

        await roomController.start(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(responseObject).toEqual(expectedResponse);
        expect(mockResponse.statusCode).toBe(expectedStatusCode);
    });

    test('finish chatting room', async () => {
        const expectedStatusCode = 200;
        const expectedResponse = {
            result: "success"
        }

        mockRequest.body = {
            uuid: `${newUuid}`,
            name: `samsung live testing - ${newUuid}`,
        }

        await roomController.finish(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(responseObject).toEqual(expectedResponse);
        expect(mockResponse.statusCode).toBe(expectedStatusCode);
    });
});