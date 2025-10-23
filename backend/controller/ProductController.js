const Product = require("../model/ProductModel");
const logger = require("../utils/WinstonLogger");

// GET PRODUCTS CONTROLLER

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    logger.info("Products fetched From Database (MongoDB)");

    res.status(200).json({
      status: "success",
      message: "Products fetched successfully from database",
      data: products,
    });
  } catch (err) {
    logger.error(`Error fetching products: ${err.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//  CREATE PRODUCT CONTROLLER (TO BE IMPLEMENTED)

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, imageUrl } =
      req.body;

    // Create product with provided fields
    const data = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      sku,
      imageUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: data,
    });

    logger.info(`Successfully created product: ${data._id}`);
  } catch (err) {
    logger.error(`Error creating product: ${err.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = { getProducts, createProduct };
