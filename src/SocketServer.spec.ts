import { createServer } from "http";
import * as server from "socket.io";
import * as client from "socket.io-client";
import { v4 as uuid } from 'uuid';
import AccountCreateDTO from "./domain/account/dto/AccountCreateDTO";
import MessageSaveDTO from "./domain/message/dto/MessageSaveDTO";
import SocketServer from "./SocketServer";

describe("SockerServerTests", () => {
    let io: server.Server;
    let socket_s: server.Socket;
    let socket_c: client.Socket;

    const roomUuid = uuid();

    const newAccount: AccountCreateDTO = {
        username: "byoungju94",
        name: "Byoungju Park",
        roomUuid: roomUuid
    };

    const newAccount2: AccountCreateDTO = {
        username: "parker00",
        name: "Peter Parker",
        roomUuid: roomUuid
    }

    beforeAll((done) => {
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

    afterAll(async () => {
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

    test('should join successfully', (done) => {
        socket_c.on("join", (msg: any) => {
            expect(msg).toStrictEqual(newAccount);
            expect(socket_s.rooms.size).toBe(2);
            expect(socket_s.rooms.has(newAccount.roomUuid)).toBe(true);

            done();
        });

        socket_c.emit('join', newAccount);
    });

    test('should send message successfully', (done) => {
        const message: MessageSaveDTO = {
            content: "Good Morning!",
            username: "byoungju94",
            name: "Byoungju Park",
            roomUuid: newAccount.roomUuid
        };

        socket_c.on("message", (response: any) => {
            expect(response).toStrictEqual(message);
            done();
        });

        socket_c.emit('message', message);
    });

    test('should notify message when another user disconnected or leaved', (done) => {
        let socket_c2 = client.io(`ws://localhost:8081/test`, {forceNew: true});
        socket_c2.on('connect', () => {
            socket_c2.emit("join", newAccount2);
        });

        socket_c2.on("leave", (response) => {
            expect(response).toStrictEqual(newAccount);

            done();
            socket_c2.close();
        });

        setTimeout(() => {
            socket_c.close();    
        }, 1000);
    });
});