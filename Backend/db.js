const sql = require("mssql");
const dotenv = require("dotenv");
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, 
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("Conectado a SQL Server");
    return pool;
  })
  .catch(err => {
    console.log("Error de conexión a SQL Server:", err);
    throw err;
  });

module.exports = poolPromise;
