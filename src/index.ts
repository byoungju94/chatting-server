import WebServer from "./WebServer";

const storageConfiguration = "mysql";

WebServer
    .bootstrap(storageConfiguration)
    .then(webserver => webserver.start());