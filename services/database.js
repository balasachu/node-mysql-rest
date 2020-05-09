const mysqldb = require('mysql');
const config = require('../config/config.js');
const logger = require('../services/logging.js');
const pool = mysqldb.createPool(config.dbconfig);

//Get DB connection
const connect = () => {
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
                reject(err);
            }
            resolve(conn);
        })
        logger.info("Mysql-> Connection Promise Ends");
    });
}
module.exports.connect = connect;

//Execute Query
const executeQuery = (con, sql, args = []) => {
    return new Promise((resolve, reject) => {
        con.query(sql, args, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}
module.exports.executeQuery = executeQuery

//Validate DB Connection during webserver server start
const db_validate = async () => {
    logger.info("db->Check DB Connectivity starts")
    let query = "SELECT 1";
    let conn;
    try {
        conn = await connect();

        const result = await executeQuery(conn, query);
        conn.release();

        logger.info("DB Connectivity is Success")
        logger.info("db->Check DB Connectivity ends")
        return result;
    } catch (error) {
        logger.error("db->DB Connectivity fails")
        if (conn)
            conn.release();
        throw error
    }
}
module.exports.db_validate = db_validate

//Close Pool on Server Shutdown
const close = () => {
    pool.end()
    return new Promise((resolve, reject) => {
        pool.end((err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}
module.exports.close = close