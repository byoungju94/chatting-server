import express from "express";

export default class WebServer {

    private webApplication: express.Application;

    constructor() {
        this.webApplication = express();
    }

    public start() {
        this.webApplication.listen(8080, () => {
            console.log("start");
        });
    }
}