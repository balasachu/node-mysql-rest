const mysqldb = require('mysql');
const config = require('../config/config.js');
const logger = require('../services/logging.js');

async function connect() {
    logger.info("Mysql->Create Pool Starts")
    const pool = mysqldb.createPool(config.dbconfig);
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



/*async function initialize() {
    await mysqldb.createPool(config.dbconfig);
}

module.exports.initialize = initialize;

async function close() {
    await mysqldb.getPool().close();
}

module.exports.close = close;

function simpleExecute(statement, binds = [], opts = {}) {
    return new Promise(async (resolve, reject) => {
        let conn;

        opts.outFormat = oracledb.OBJECT;
        opts.autoCommit = true; 

        try {
            conn = await mysqldb.getConnection();

            const result = await conn.execute(statement, binds, opts);

            resolve(result);
        } catch (err) {
            reject(err);
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    });
}

module.exports.simpleExecute = simpleExecute;*/