const sql = require('mssql');

const config = {
  user: 'alejandroadmin',
  password: 'alejandro2004',
  server: 'DESKTOP-OG43GHC\\SQLEXPRESS',
  database: 'CRM',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: 'SQLEXPRESS',
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};


const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect()
  .then(pool => {
    console.log('✅ Conexión exitosa a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error al conectar a SQL Server:', err);
    
    process.exit(1);
  });

module.exports = {
  sql,
  poolConnect,
  pool
};