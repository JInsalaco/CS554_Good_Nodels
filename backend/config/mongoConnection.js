const MongoClient = require("mongodb").MongoClient;
let _connection = undefined;
let _db = undefined;

const settings = {
  serverUrl: process.env.MONGO_URL,
  database: "weddio",
};

console.log(settings.serverUrl);

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(settings.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = await _connection.db(settings.database);
  }

  return _db;
};
