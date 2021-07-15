import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import { Sequelize } from 'sequelize-typescript';
import WebServer from "./WebServer";
import StorageConfiguration from './configuration/StorageConfiguration';

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