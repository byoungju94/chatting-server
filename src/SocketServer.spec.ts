import { createServer } from "http";
import { Sequelize } from 'sequelize-typescript';
import * as server from "socket.io";
import * as client from "socket.io-client";
import StorageConfiguration from "./configuration/StorageConfiguration";
import AccountRepository from "./domain/account/AccountRepository";
import AccountCreateDTO from "./domain/account/dto/AccountCreateDTO";
import SocketServer from "./SocketServer";

describe("SockerServerTests", () => {
    let io: server.Server;
    let socket_s: server.Socket;
    let socket_c: client.Socket;

    let sequelize: Sequelize;
    let accountRepository: AccountRepository;

    beforeAll(async (done) => {
        const httpServer = createServer();
        io = new server.Server(httpServer);
        httpServer.listen(8081);
    
        io.of("/test").on("connection", async socket => {
            socket_s = socket;
            await SocketServer.registerEventHandler(socket, "test");
        });

        socket_c = client.io(`ws://localhost:8081/test`);
        socket_c.on('connect', done);

        sequelize = await StorageConfiguration.initialize("mysql", "test");
        accountRepository = new AccountRepository(sequelize);
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

    test('should join successfully', () => {
        const send: AccountCreateDTO = {
            username: "byoungju94",
            name: "Byoungju Park",
            roomUuid: "32454-0123-012412"
        };

        socket_c.on("join", (received: AccountCreateDTO) => {
            expect(received).toBe(send);
        });

        socket_c.emit('join', send);
    });

    test('should send message successfully', () => {

    });
});