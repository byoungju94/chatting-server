import express, { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import StorageConfiguration from "./configuration/StorageConfiguration";
import AccountController from "./controller/AccountController";
import MessageController from "./controller/MessageController";
import RoomController from "./controller/RoomController";

export default class WebServer {

    private readonly webApplication: express.Application;

    private accountController: AccountController;
    private roomController: RoomController;
    private messageController: MessageController;
    private sequelize: Sequelize;

    private constructor(sequelize: Sequelize) {
        this.webApplication = express();

        this.accountController = new AccountController(sequelize);
        this.roomController = new RoomController(sequelize);
        this.messageController = new MessageController(sequelize);
    }

    public static async bootstrap(storageType: string) {
        return new WebServer(await StorageConfiguration.initialize(storageType, "default"));
    }

    public async selectDataSource(req: Request, res: Response, next: NextFunction) {
        const domain = req.hostname.replace("http://", "").replace("https://", "").split(".");
        if (domain.length < 3) {
            res.statusCode = 500;
            return;
        }

        this.sequelize = await StorageConfiguration.initialize("mysql", domain[0]);
        
        this.accountController = new AccountController(this.sequelize);
        this.roomController = new RoomController(this.sequelize);
        this.messageController = new MessageController(this.sequelize);

        next();
    }

    public getDataSource() {
        return this.sequelize;
    }

    private registerRouters(): void {
        this.webApplication.get("/account/:id", this.selectDataSource, this.accountController.join.bind(this.accountController));
        this.webApplication.post("/account/:id", this.selectDataSource, this.accountController.leave.bind(this.accountController));

        this.webApplication.post("/room/start", this.selectDataSource, this.roomController.start.bind(this.roomController));
        this.webApplication.post("/room/finish", this.selectDataSource, this.roomController.finish.bind(this.roomController));

        this.webApplication.post("/message/history", this.selectDataSource, this.messageController.history.bind(this.messageController));
    }

    public start(): express.Application {
        this.registerRouters();
        this.webApplication.listen(8080, () => {
            console.log("WebServer Start!");
        });

        return this.webApplication;
    }
}