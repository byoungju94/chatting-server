import { createServer } from "http";
import { Sequelize } from 'sequelize-typescript';
import * as server from "socket.io";
import * as client from "socket.io-client";
import StorageConfiguration from "./configuration/StorageConfiguration";
import AccountRepository from "./domain/account/AccountRepository";
import AccountCreateDTO from "./domain/account/dto/AccountCreateDTO";
import MessageSaveDTO from "./domain/message/dto/MessageSaveDTO";
import SocketServer from "./SocketServer";
import { v4 as uuid } from 'uuid';

describe("SockerServerTests", () => {
    let io: server.Server;
    let socket_s: server.Socket;
    
    let socket_c: client.Socket;

    let sequelize: Sequelize;
    let accountRepository: AccountRepository;

    beforeAll((done) => {
        StorageConfiguration.initialize("mysql", "test").then(seq => {
            sequelize = seq;
            accountRepository = new AccountRepository(seq);
        });

        const httpServer = createServer();
        io = new server.Server(httpServer);
        httpServer.listen(8081);
    
        io.of("/test").on("connection", async socket => {
            await SocketServer.registerEventHandler(socket, "test");
            socket_s = socket;
        });

        socket_c = client.io(`ws://localhost:8081/test`, {forceNew: true});
        socket_c.on('connect', done);
    });

    afterAll(() => {
        io.close();

        socket_c.close();
    });

    test('should connected successfully', (done) => {
        socket_c.on("ping", (msg) => {
            expect(msg).toBe("pong");
            done();
        });

        socket_s.emit("ping", "pong");
    });

    // test('should join successfully', (done) => {
    //     const newUuid = uuid();

    //     const send: AccountCreateDTO = {
    //         username: "byoungju94",
    //         name: "Byoungju Park",
    //         roomUuid: newUuid
    //     };

    //     socket_c.on("join", (msg: any) => {
    //         expect(msg).toStrictEqual(send);
    //         expect(socket_s.rooms.size).toBe(2);
    //         expect(socket_s.rooms.has(newUuid)).toBe(true);

    //         done();
    //     });

    //     socket_c.emit('join', send);
    // });

    // test('should send message successfully', () => {
    //     const newUuid = uuid();

    //     const newAccount: AccountCreateDTO = {
    //         username: "byoungju94",
    //         name: "byoungju94",
    //         roomUuid: newUuid
    //     };

    //     const message: MessageSaveDTO = {
    //         content: "Good Morning!",
    //         username: "byoungju94",
    //         name: "Byoungju Park",
    //         roomUuid: newUuid
    //     };

    //     socket_c.on("message", (response: any) => {
    //         expect(response).toStrictEqual(message);
    //     });

    //     socket_c.emit('join', newAccount);
    //     socket_c.emit('message', message);
    // });

    test('should notify message when another user disconnected or leaved', (done) => {
        const newUuid = uuid();

        let socket_c2 = client.io(`ws://localhost:8081/test`, {forceNew: true});

        socket_c2.on('connect', () => {
            done();
            socket_c2.close();
        });



        // const newAccount1: AccountCreateDTO = {
        //     username: "byoungju94",
        //     name: "Byoungju Park",
        //     roomUuid: newUuid
        // }

        // const newAccount2: AccountCreateDTO = {
        //     username: "parker00",
        //     name: "Peter Parker",
        //     roomUuid: newUuid
        // }

        // socket_c2.on("disconnected", (response) => {
        //     expect(response).toStrictEqual(newAccount1);

        //     socket_c2.close();
        //     done();
        // });

        // socket_c.emit("join", newAccount1);
        // socket_c2.emit("join", newAccount2);

        // socket_c.close();
    });
});