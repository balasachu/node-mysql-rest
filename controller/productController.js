const db_product = require('../db_apis/db_product.js');
const logger = require('../services/logging.js');

//Get All Product and Get Product by id
async function get(req, res, next) {
  try {
    logger.info("ProductController->Get Product Starts")
    
    const context = {};

    //If Get Product by id
    if (req.params.id) {
      context.id = parseInt(req.params.id);
    }
    const rows = await db_product.get(context);
    res.status(200).send({ result: rows });
    logger.info("ProductController->Get Product Ends")
  } catch (err) {
    logger.info("ProductController->Get Product Failed")
    next(err);
  }
}

module.exports.get = get;