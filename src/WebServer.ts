import express from "express";
import { Sequelize } from "sequelize-typescript";
import StorageConfiguration from "./configuration/StorageConfiguration";
import AccountController from "./controller/AccountController";

export default class WebServer {

    private readonly webApplication: express.Application;
    
    private accountController: AccountController;

    private constructor(sequelize: Sequelize) {
        this.webApplication = express();
        this.accountController = new AccountController(sequelize);
    }

    public static async bootstrap(storageType: string) {
        const sequelize = await StorageConfiguration.initialize("mysql", "samsung");
        return new WebServer(sequelize);
    }

    private middlewares(): void {
        this.webApplication.use(async (req, res, next) => {
            const tenant = req.headers.host?.toString();
            const sequelize = await StorageConfiguration.initialize("mysql", "samsung"!!);
            this.accountController = new AccountController(sequelize);
            next();
        });
    }

    private routers(): void {
        this.webApplication.get("/account/:id", this.accountController.get.bind(this.accountController));
        this.webApplication.post("/account/:id", this.accountController.post.bind(this.accountController));
    }

    public start(): express.Application {
        this.middlewares();
        this.routers();

        this.webApplication.listen(8080, () => {
            console.log("start");
        });

        return this.webApplication;
    }
}