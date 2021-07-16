import { NextFunction, Request, Response } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';
import StorageConfiguration from '../configuration/StorageConfiguration';
import MessageDTO from '../domain/message/dto/MessageDTO';
import MessageRepository from '../domain/message/MessageRepository';
import RoomRepository from '../domain/room/RoomRepository';
import MessageController from './MessageController';

describe("MessageControllerTests", () => {
    let messageController: MessageController;
    let messageRepository: MessageRepository;

    let roomRepository: RoomRepository;

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: Partial<Response>;
    let responseObject = {};

    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = await StorageConfiguration.change("mysql", "test");
        messageController = new MessageController(sequelize);
        messageRepository = new MessageRepository(sequelize);
        roomRepository = new RoomRepository(sequelize);
    });

    beforeEach(async () => {
        await messageRepository.clean();
        await roomRepository.clean();

        mockRequest = {};
        mockResponse = {
            statusCode: 0,
            send: jest.fn().mockImplementation(result => {
                responseObject = result;
            })
        };
    });

    afterEach(async () => {
        await messageRepository.clean();
        await roomRepository.clean();
    });
    
    afterAll(async () => {
        await sequelize.close();
    })

    test('get chatting log per room', async () => {
        const expectedStatusCode = 200;
        const expectedResponse = {};

        const newUuid = uuid();

        // given
        const room1 = { uuid: newUuid, name: "test live chat 123" };
        await roomRepository.create(room1);

        const messageList = [
            { 
                content: "Hello, World!", 
                username: "byoungju94",
                name: "Byoungju Park",
                roomUuid: newUuid
            },
            {
                content: "Good Morning!", 
                username: "byoungju94",
                name: "Byoungju Park",
                roomUuid: newUuid    
            },
            {
                content: "See you later!",
                username: "byoungju94",
                name: "Byoungju Park",
                roomUuid: newUuid    
            }
        ];

        await messageRepository.create(messageList[0]);
        await messageRepository.create(messageList[1]);
        await messageRepository.create(messageList[2]);

        // when
        mockRequest.body = {
            roomUuid: newUuid
        };

        await messageController.history(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        // then
        expect(mockResponse.statusCode).toBe(expectedStatusCode);
        expect((responseObject as Array<MessageDTO>).length).toEqual(3);
    });
});
