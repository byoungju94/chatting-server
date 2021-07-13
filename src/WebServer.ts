import express from "express";
import { Sequelize } from "sequelize-typescript";
import StorageConfiguration from "./configuration/StorageConfiguration";
import AccountController from "./controller/AccountController";
import RoomController from "./controller/RoomController";

export default class WebServer {

    private readonly webApplication: express.Application;
    
    private accountController: AccountController;
    private roomController: RoomController;

    private constructor(sequelize: Sequelize) {
        this.webApplication = express();
        this.accountController = new AccountController(sequelize);
        this.roomController = new RoomController(sequelize);
    }

    public static async bootstrap(storageType: string) {
        const sequelize = await StorageConfiguration.initialize("mysql", "samsung");
        return new WebServer(sequelize);
    }

    private registerMiddlewares(): void {
        this.webApplication.use(async (req, res, next) => {
            const tenant = req.headers.host?.toString();
            const sequelize = await StorageConfiguration.initialize("mysql", tenant!!);
            this.accountController = new AccountController(sequelize);
            next();
        });
    }

    private registerRouters(): void {
        this.webApplication.get("/account/:id", this.accountController.join.bind(this.accountController));
        this.webApplication.post("/account/:id", this.accountController.leave.bind(this.accountController));

        this.webApplication.post("/room/start", this.roomController.start.bind(this.roomController));
        this.webApplication.post("/room/finish", this.roomController.finish.bind(this.roomController));
    }

    public start(): express.Application {
        this.registerMiddlewares();
        this.registerRouters();

        this.webApplication.listen(8080, () => {
            console.log("start");
        });

        return this.webApplication;
    }
}