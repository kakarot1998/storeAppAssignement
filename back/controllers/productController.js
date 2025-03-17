const Product = require('../models/product.js');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating } = req.body;

    const newProduct = new Product({
      code,
      name,
      description,
      image,
      category,
      price,
      quantity,
      internalReference,
      shellId,
      inventoryStatus,
      rating,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err });
  }
};

// Update product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { code, name, description, image, category, price, quantity, internalReference, shellId, inventoryStatus, rating } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.code = code || product.code;
    product.name = name || product.name;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.internalReference = internalReference || product.internalReference;
    product.shellId = shellId || product.shellId;
    product.inventoryStatus = inventoryStatus || product.inventoryStatus;
    product.rating = rating || product.rating;
    product.updatedAt = Date.now();

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.status(200).json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
