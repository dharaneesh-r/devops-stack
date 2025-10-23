const express = require("express");
const ProductRouter = express.Router();
const cors = require("cors");
const logger = require("../utils/WinstonLogger");
const {
  getProducts,
  createProduct,
} = require("../controller/ProductController");

ProductRouter.use(cors());


// GET all products

ProductRouter.get("/products", async (req, res, next) => {
  try {
    await getProducts(req, res, next);
    logger.info("GET /products called");
  } catch (err) {
    logger.error(`GET /products error: ${err.message}`);
    next(err);
  }
});

ProductRouter.post("/products", async (req, res, next) => {
  try {
    await createProduct(req, res, next);
    logger.info("POST /products called");
  } catch (err) {
    logger.error(`POST /products error: ${err.message}`);
    next(err);
  }
});

// module.exports

module.exports = ProductRouter;
