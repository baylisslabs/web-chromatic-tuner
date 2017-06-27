
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as expressLogging from "express-logging";
import * as logger from "logops";
import * as https from "https";
import * as fs from "fs";

export class App {
  private app: express.Express;
  private port: number;

  constructor(port: number) {
    this.port = port;

    this.app = express();

    if(process.env.NODE_ENV != "production") {
      this.app.use(expressLogging(logger));
    }

    this.app.use(bodyParser.json());
    this.app.use(express.static(path.resolve(__dirname,"../www"),{
        etag: false
    }));

    this.configureErrorHandler();
  }

  start() {
    const privateKey  = fs.readFileSync(path.resolve(__dirname,"../../sslcerts/server.key"), "utf8");
    const certificate = fs.readFileSync(path.resolve(__dirname,"../../sslcerts/server.pem"), "utf8");
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, this.app);
    httpsServer.listen(3443,()=>{
        console.log("web-chromatic-tuner server listening on https://localhost:%d", this.port);
    });
    /*this.app.listen(this.port, () => {
        console.log("web-chromatic-tuner server listening on http://localhost:%d", this.port);
    });*/
  }

  private configureErrorHandler() {
    this.app.use(((err, req, res, next) => {
        res.status(500).json({ message: err.message });
    }) as any);
  };
}
