import mongoose from "mongoose";
import config from "config";
import logger from "../startup/logger.js";

const log = logger.child({module: 'connectDB'})

export default async function database() {
  const db = config.get("db");

  await mongoose
    .connect(`mongodb://${db.host}:${db.port}/${db.dbName}`, {
      useNewUrlParser: true,
    })
    .then(() => {
      log.info("Connected to MongoDB");
    })
    .catch((err) => {
      log.error("Problem connecting to MongoDB.", err.message);
      process.exit(1);
    });
}
