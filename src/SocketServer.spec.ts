import { createServer, Server } from "http";
import { AddressInfo } from "net";
import * as server from "socket.io";
import * as client from "socket.io-client";

describe("SockerServerTests", () => {
    let serverIO: server.Server;
    let serverSocket: server.Socket;
    let clientSocket: client.Socket;

    beforeAll((done) => {
        const httpServer: Server = createServer();
        serverIO = new server.Server(httpServer);

        httpServer.listen(() => {
            const { port } = httpServer.address() as AddressInfo;
            clientSocket = client.io(`http://localhost:${port}`);
            serverIO.on("connection", (socket: server.Socket) => {
                serverSocket = socket;
            });

            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        serverIO.close();
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