const database = require('../services/database.js');
const dbQuery = require('../db_query/productQuery.js');
const logger = require('../services/logging.js');

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
    
    conn = await database.connect();

    const result = await database.simpleExecute(conn, query,binds);
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