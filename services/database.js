const mysqldb = require('mysql');
const config = require('../config/config.js');
const logger = require('../services/logging.js');
const pool = mysqldb.createPool(config.dbconfig);

async function connect() {
    logger.info("Mysql->Create Pool Starts")
    const conn = await getConnection(pool)
    logger.info("Mysql->Create Pool Ends")
    return conn;
}
module.exports.connect = connect;

function getConnection(pool) {
    return new Promise((resolve, reject) => {
        logger.info("Mysql-> Connection Promise Starts");
        pool.getConnection(function (err, conn) {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.')
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.')
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.')
                }
                if (conn) conn.release()
                reject(err);
            }
            resolve(conn);
        })
        logger.info("Mysql-> Connection Promise Ends");
    });
}

function simpleExecute(con, sql, args = []) {
    return new Promise((resolve, reject) => {
        con.query(sql, args, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
module.exports.simpleExecute = simpleExecute

async function db_validate(context) {
    logger.info("db->Check DB Connectivity starts")
    let query = "SELECT 1";
    let conn;
    try {
      conn = await connect();
  
      const result = await simpleExecute(conn, query);
      conn.release();

      logger.info("DB Connectivity is Success")  
      logger.info("db->Check DB Connectivity ends")
      return result;
    } catch (error) {
      logger.error("db->DB Connectivity fails")
      if(conn)
        conn.release();
      throw error
    }
  }
  module.exports.db_validate = db_validate