const mysql = require("mysql");
require("dotenv").config();
const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;
const dbPort = process.env.DB_PORT;
const db = mysql.createPool({
  // sesuaikan konfigurasi dengan server
  host: dbHost,
  user: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  port: dbPort,
});

module.exports = db;
