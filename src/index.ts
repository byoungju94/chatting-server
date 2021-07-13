import express from "express";
import http from "http";
import SocketServer from "./SocketServer";
import WebServer from "./WebServer";

const storageConfiguration = "mysql";

WebServer
    .bootstrap(storageConfiguration)
    .then(webserver => {
        const application: express.Application = webserver.start();
        const httpServer: http.Server = http.createServer(application);
        new SocketServer(httpServer);
    });