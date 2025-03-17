const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
const PORT = 5000;

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');


const dataFilePath = path.join(__dirname, 'data/data.json');

const readData = async () => {
  try {
    const data = await fs.readJson(dataFilePath);
    return data;
  } catch (err) {
    console.error('Error reading data from file:', err);
    return null;
  }
};

const mockUsers = [
  { id: 1, email: 'admin@admin.com', password: 'adminpass', username: 'admin', firstname: 'Admin' },
  { id: 2, email: 'user1@example.com', password: 'userpass', username: 'user1', firstname: 'User' }
];

const secretKey = process.env.JWT_SECRET;
app.use(bodyParser.json());

app.post('/api/account', (req, res) => {
  const { username, firstname, email, password } = req.body;
  const existingUser = mockUsers.find(user => user.email === email);
  if (password.length < 6) {
    return res.status(500).json({ message: 'Password should be 6 caracters minimum' });
  }
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { id: mockUsers.length + 1, username, firstname, email, password, cart: [], wishlist: [] };
  mockUsers.push(newUser);
  res.status(201).json({ message: 'User created successfully' });
});

// POST /api/token route
app.post(`/api/token`, (req, res) => {
  const { email, password } = req.body;
  console.log('Received login attempt:', email, password);

  const user = mockUsers.find(u => u.email === email);

  if (!user || user.password !== password) {
    console.log('Invalid credentials');
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

const writeData = async (data) => {
  try {
    await fs.writeJson(dataFilePath, data, { spaces: 2 });
  } catch (err) {
    console.error('Error writing data to file:', err);
  }
};

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // Set user info from token for later use
    next(); // Proceed to the route handler
  });
}

const apiPrefix = '/api';


app.get(`${apiPrefix}/products`, authenticateToken, async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Access Denied' });
  }

  const decoded = jwt.verify(token, secretKey);
  const user = mockUsers.find(u => u.id === decoded.userId);
  if (!user || user.email !== 'admin@admin.com') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { name, price, image } = req.body;
  const newProduct = { id: mockProducts.length + 1, name, price, image };
  mockProducts.push(newProduct);
  res.status(201).json({ message: 'Product added successfully' });
});


app.get(`${apiPrefix}/products/:id`, authenticateToken, async (req, res) => {
  const data = await readData();
  const product = data.products.find(p => p.id == req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post(`${apiPrefix}/products`, authenticateToken, async (req, res) => {
  const { name, description, price, quantity, category, image, inventoryStatus, rating } = req.body;
  const data = await readData();
  const newProduct = {
    id: data.products.length + 1,
    name,
    description,
    price,
    quantity,
    category,
    image,
    inventoryStatus,
    rating
  };
  data.products.push(newProduct);
  await writeData(data);
  res.status(201).json(newProduct);
});

// 4. Update a product
app.put(`${apiPrefix}/products/:id`, authenticateToken, async (req, res) => {
  const { name, description, price, quantity, category, image, inventoryStatus, rating } = req.body;
  const data = await readData();
  const product = data.products.find(p => p.id == req.params.id);
  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;
    product.image = image || product.image;
    product.inventoryStatus = inventoryStatus || product.inventoryStatus;
    product.rating = rating || product.rating;
    await writeData(data);
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// 5. Delete a product
app.delete(`${apiPrefix}/products/:id`, authenticateToken, async (req, res) => {
  const data = await readData();
  const productIndex = data.products.findIndex(p => p.id == req.params.id);
  if (productIndex > -1) {
    data.products.splice(productIndex, 1);
    await writeData(data);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
