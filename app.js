import express from "express";
import morgan from "morgan";
import cors from 'cors'
import helmet from 'helmet'
import sanitizeMongo from "express-mongo-sanitize";
import logger from "./startup/logger.js";
import authRouter from "./routes/auth/index.js";
import classRouter from "./routes/class.js";
import schoolUsersRouter from "./routes/internal.js";
import database from "./startup/database.js";
import handleErrors from "./middleware/handleErrors.js";

const app = express();
const log = logger.child({ module: "scholla:app" });
database();

log.info(process.env.NODE_ENV);
log.warn(app.get("env")); //if NODE_ENV is undefined, returns development

app.use(morgan("tiny"));
app.use(cors())
app.use(helmet())
app.use(express.json());
app.use(sanitizeMongo());

app.get("/", (req, res) => {
  res.send({ data: { healthStatus: "Running" } });
});
app.use("/auth", authRouter);
app.use("/class", classRouter)
app.use("/school/users", schoolUsersRouter)

// error handler middleware
app.use(handleErrors);

export default app;
