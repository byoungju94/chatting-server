import { NextFunction, Request, Response } from 'express';
import WebServer from "./WebServer";

describe("MiddlewareTests", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: Partial<NextFunction>;
    let responseObject = {};

    let webServer: WebServer;

    beforeAll(async () => {
        webServer = await WebServer.bootstrap("mysql");
    });

    beforeEach(async () => {
        mockRequest = {};
        mockResponse = {
            statusCode: 0,
            send: jest.fn().mockImplementation(result => {
                responseObject = result;
            })
        };
        mockNext = jest.fn()
    });

    test('should switch database connection from host', async () => {
        // given
        mockRequest.hostname = "https://test.byoungju94.me";

        // when
        await webServer.selectDataSource(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        // then
        expect(mockNext).toBeCalledTimes(1);
        expect(webServer.getDataSource().config.database).toBe("chat_test");
        
    });

    test('should raised exception when switching database connection using empty subdomain', async () => {
        // given
        mockRequest.hostname = "https://byoungju94.me";

        // when
        await webServer.selectDataSource(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        // then
        expect(mockResponse.statusCode).toBe(500);
    });
});