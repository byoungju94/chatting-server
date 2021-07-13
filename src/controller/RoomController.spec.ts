import { Request, Response, NextFunction } from 'express';
import StorageConfiguration from '../configuration/StorageConfiguration';
import RoomController from './RoomController';
import { uuid } from 'uuidv4';
import RoomRepository from '../domain/room/RoomRepository';
import RoomDTO from '../domain/room/dto/RoomDTO';

describe("RoomControllerTests", () => {
    let roomController: RoomController;
    let roomRepository: RoomRepository;

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: Partial<NextFunction>;
    let responseObject = {};

    const newUuid = uuid();

    beforeEach(async () => {
        const sequelize = await StorageConfiguration.initialize("mysql", "test");
        roomController = new RoomController(sequelize);
        roomRepository = new RoomRepository(sequelize);

        mockRequest = {};
        mockResponse = {
            statusCode: 0,
            send: jest.fn().mockImplementation(result => {
                responseObject = result;
            })
        };
    });

    afterEach(async () => {
        await roomRepository.clean();
    });

    test('starting new chatting room', async () => {
        const expectedStatusCode = 200;
        const expectedResponse = {
            result: "success"
        }

        // given
        mockRequest.body = {
            uuid: `${newUuid}`,
            name: `samsung live testing - ${newUuid}`,
        }

        // when
        await roomController.start(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        // then
        expect(mockResponse.statusCode).toBe(expectedStatusCode);
        expect(responseObject).toEqual(expectedResponse);
    });

    test('finish chatting room', async () => {
        const expectedStatusCode = 200;
        const expectedResponse = {
            result: "success"
        }

        // given
        mockRequest.body = {
            uuid: `${newUuid}`,
            name: `samsung live testing - ${newUuid}`,
        }

        // when
        await roomController.finish(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        // then
        expect(mockResponse.statusCode).toBe(expectedStatusCode);
        expect(responseObject).toEqual(expectedResponse);
    });

    test('get activate chatting room', async () => {
        const expectedStatusCode = 200;
        const expectedResponse = {};

        // then
        const uuid1 = uuid();
        const uuid2 = uuid();
        const uuid3 = uuid();
        const uuid4 = uuid();

        const room1 = { uuid: uuid1, name: "test live chat 1" };
        const room2 = { uuid: uuid2, name: "test live chat 2" };
        const room3 = { uuid: uuid3, name: "test live chat 3" };
        const room4 = { uuid: uuid4, name: "test live chat 4" };

        await roomRepository.create(room1);
        await roomRepository.create(room2);
        await roomRepository.create(room3);
        await roomRepository.create(room4);

        function sleep(ms: number) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        await sleep(1000);

        await roomRepository.createAsLock(room1);

        // when
        await roomController.active(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        // then
        expect(mockResponse.statusCode).toBe(expectedStatusCode);
        expect((responseObject as Array<RoomDTO>).length).toEqual(3);
        expect((responseObject as Array<RoomDTO>).filter(element => element.state === "LOCKED")).toEqual([]);
    });
});
