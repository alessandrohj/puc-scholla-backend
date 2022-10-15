import mongoose from "mongoose";
import config from "config";
import logger from "../startup/logger.js";

const log = logger.child({ module: "connectDB" });

export default async function database() {
  const { scheme, host, port, name, username, password, authSource } =
    config.get("db");

  const credentials = username && password ? `${username}:${password}@` : "";

  let connectionString = `${scheme}://${credentials}${host}`;

  if (scheme === "mongodb") {
    connectionString += `:${port}/${name}?authSource=${authSource}`;
  } else {
    connectionString += `/${authSource}?retryWrites=true&w=majority`;
  }

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      dbName: name,
    });
    log.info(`Connected to MongoDB @ ${connectionString}`);
  } catch (err) {
    log.error("Problem connecting to MongoDB.", err);
    process.exit(1);
  }
}
