const mongoose = require("mongoose");

let readConnection;
let writeConnection;

async function connectDatabases() {
  if (!readConnection) {
    readConnection = mongoose.createConnection(process.env.MONGO_READ_URI, {
      dbName: process.env.MONGO_DB_NAME,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000
    });

    readConnection.on("error", (error) => {
      console.error("READ connection error:", error.message);
    });
  }

  if (!writeConnection) {
    writeConnection = mongoose.createConnection(process.env.MONGO_WRITE_URI, {
      dbName: process.env.MONGO_DB_NAME,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000
    });

    writeConnection.on("error", (error) => {
      console.error("WRITE connection error:", error.message);
    });
  }

  await Promise.all([
    readConnection.asPromise(),
    writeConnection.asPromise()
  ]);

  console.log("MongoDB READ connection: connected");
  console.log("MongoDB WRITE connection: connected");
}

function getReadDb() {
  if (!readConnection) throw new Error("READ database is not connected.");
  return readConnection.db;
}

function getWriteDb() {
  if (!writeConnection) throw new Error("WRITE database is not connected.");
  return writeConnection.db;
}

module.exports = {
  connectDatabases,
  getReadDb,
  getWriteDb
};
