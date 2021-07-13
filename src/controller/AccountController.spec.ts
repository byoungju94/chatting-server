import { Request, Response, NextFunction } from 'express';
import { uuid } from 'uuidv4';
import StorageConfiguration from '../configuration/StorageConfiguration';
import AccountController from './AccountController';
import AccountRepository from '../domain/account/AccountRepository';
import AccountCreateDTO from '../domain/account/dto/AccountCreateDTO';
import RoomRepository from '../domain/room/RoomRepository';

describe("AccountControllerTests", () => {
    let accountController: AccountController;
    let accountRepository: AccountRepository;

    let roomRepository: RoomRepository;

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: Partial<NextFunction>;
    let responseObject = {};

    beforeEach(async () => {
        const sequelize = await StorageConfiguration.initialize("mysql", "test");
        accountController = new AccountController(sequelize);
        accountRepository = new AccountRepository(sequelize);

        roomRepository = new RoomRepository(sequelize);

        mockRequest = {};
        mockResponse = {
            statusCode: 0,
            send: jest.fn().mockImplementation(result => {
                responseObject = result;
            })
        }
    });

    afterEach(async () => {
        await accountRepository.clean();
        await roomRepository.clean();
    });

    test('join a room', async () => {
        // given
        const newUuid = uuid();
        await roomRepository.create({
            uuid: newUuid,
            name: "live chatting room test"
        });

        const newAccount: AccountCreateDTO = {
            username: "byoungju94",
            name: "Byoungju Park",
            roomUuid: newUuid
        };
        mockRequest.body = newAccount;

        // when
        await accountController.join(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        // then
        const connect = await accountRepository.connect(newUuid);
        expect(connect[0].username).toEqual(newAccount.username);
        expect(connect[0].name).toEqual(newAccount.name);
        expect(connect.length).toEqual(1);

        expect(mockResponse.statusCode).toBe(200);
    });
});