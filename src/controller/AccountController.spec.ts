import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import StorageConfiguration from '../configuration/StorageConfiguration';
import AccountController from './AccountController';
import AccountRepository from '../domain/account/AccountRepository';
import AccountCreateDTO from '../domain/account/dto/AccountCreateDTO';
import RoomRepository from '../domain/room/RoomRepository';
import { Sequelize } from 'sequelize-typescript';

describe("AccountControllerTests", () => {
    let accountController: AccountController;
    let accountRepository: AccountRepository;

    let roomRepository: RoomRepository;

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: Partial<NextFunction>;
    let responseObject = {};

    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = await StorageConfiguration.initialize("mysql", "test");
        accountController = new AccountController(sequelize);
        accountRepository = new AccountRepository(sequelize);
        roomRepository = new RoomRepository(sequelize);
    });

    beforeEach(async () => {
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

    afterAll(async () => {
        await sequelize.close();
    })

    test('should join a room successfully', async () => {
        // given
        const newUuid = uuid();
        
        await roomRepository.create({
            uuid: newUuid,
            name: "live chatting room test"
        });

        const joinAccount: AccountCreateDTO = {
            username: "byoungju94",
            name: "Byoungju Park",
            roomUuid: newUuid
        };
        mockRequest.body = joinAccount;
        

        // when
        await accountController.join(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        // then
        const connect = await accountRepository.connect(newUuid);
        
        expect(connect[0].username).toEqual(joinAccount.username);
        expect(connect[0].name).toEqual(joinAccount.name);
        expect(connect.length).toEqual(1);

        expect(mockResponse.statusCode).toBe(200);
    });

    test('should leave a room successfully', async () => {
        // given
        const newUuid = uuid();

        await roomRepository.create({
            uuid: newUuid,
            name: "live chatting room test1"
        });

        const newAccount: AccountCreateDTO = {
            username: "byoungju94",
            name: "Byoungju Park",
            roomUuid: newUuid
        };

        await accountRepository.createAsJoin(newAccount);

        function sleep(ms: number) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        await sleep(1000);

        mockRequest.body = newAccount;

        // when
        await accountController.leave(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        // then
        const connect = await accountRepository.connect(newUuid);
        expect(connect.length).toEqual(0);
        expect(mockResponse.statusCode).toBe(200);
    });
});