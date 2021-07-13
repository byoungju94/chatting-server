import { createServer, Server } from "http";
import * as server from "socket.io";
import * as client from "socket.io-client";
import SocketServer from "./SocketServer";
import WebServer from "./WebServer";

describe("SockerServerTests", () => {
    let io: server.Server;
    let serverSocket: server.Socket;
    let clientSocket: client.Socket;

    beforeAll(async (done) => {
        const webServer = await WebServer.bootstrap("mysql");
        const application = webServer.start();

        const httpServer: Server = createServer(application);
        io = new SocketServer(httpServer).get();

        clientSocket = client.io(`http://localhost:8080`);
        
        io.on("connection", (socket: server.Socket) => {
            serverSocket = socket;
        });

        clientSocket.on("connect", done);
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test('should connected successfully', (done) => {
        clientSocket.on("ping", (msg) => {
            expect(msg).toBe("pong");
            done();
        });

        serverSocket.emit("ping", "pong");
    }); 
});