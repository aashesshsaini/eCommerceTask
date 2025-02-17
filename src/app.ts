import express, { Request, Response, NextFunction, Express } from "express"
import * as helmet from 'helmet';
import passport from "passport"
import bodyParser from "body-parser"
import path from "path"
import cors from "cors"
import morgan from "morgan"
import { authLimiter } from "./middlewares/common"
import passportConfig from "./config/passport"
import i18n from "./middlewares/i18n"
import routes from "./routes"
import { errorHandler, routeNotFoundHandler } from "./middlewares/common"
import swaggerUI from "swagger-ui-express"
import swaggerDocs from "./swagger.json"

const app = express();

const file = path.join(__dirname + "/../");

app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(file));
app.use((req: Request, res: Response, next: NextFunction) => {
  i18n.init(req as any, res as any, next);
});

app.use(morgan("dev"));
app.use(cors());
app.use(helmet.default());
app.options("*", cors());
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));
app.use(passport.initialize());
passportConfig(passport);

app.use("/user/auth", authLimiter);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/", routes);

app.use((req, res, next) => {
  routeNotFoundHandler(req, res, next);
});

app.use(errorHandler);

export default app;