const database = require('../services/database.js');
const dbQuery = require('../db_query/productQuery.js');
const logger = require('../services/logging.js');

//Fetch product from DB
async function get(context) {
  logger.info("db->Retrieve product details starts")
  let query = dbQuery.prodSelQuery;
  const binds = [];

  if (context.id) {
    binds.push(context.id)
    query += ` where product_id = ?`;
  }

  let conn;
  try {
    /**
     * Note: We can also use conn = database.pool . This is a shortcut for the pool.getConnection() -> connection.query() -> connection.release() code flow. 
     * Using pool.getConnection() is useful to share connection state for subsequent queries. 
     * This is because two calls to pool.query() may use two different connections and run in parallel. 
     * conn.release() should be remove when using database.pool
     */

    conn = await database.connect();

    const result = await database.executeQuery(conn, query,binds);
    conn.release();
    logger.info("db->Retrieve product details ends")
    return result;
  } catch (error) {
    logger.error("db->retrieve product details Fails")
    if(conn)
      conn.release();
    throw error
  }
}

module.exports.get = get;