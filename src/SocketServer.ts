import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

export default class SocketServer {

    private readonly io: Server;
 
    constructor(httpServer: http.Server) {
        this.io = new Server();
        this.io.attach(httpServer);

        // const httpServer: http.Server = http.createServer(application);s

        this.registerListeners();
    }

    private registerListeners(): void {
        this.io.on('connection', (socket: Socket) => {
            socket.on("disconnect", () => {

            });
        });
    }
}
