require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const { HoldingsModel } = require('./model/HoldingsModel');
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require('./model/OrdersModel');
const authRoutes = require('./routes/auth');


const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL;

const app = express();

// CORS configuration for mobile and web access
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.43.122:3000', 'http://192.168.43.122:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser with increased limit for mobile uploads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Mount auth routes
app.use('/api/auth', authRoutes);

app.get('/allHoldings', async(req, res) => {
    let allHoldings =  await HoldingsModel.find({});
    res.json(allHoldings);
});

app.get('/allPositions', async(req, res) => {
    let allPositions =  await PositionsModel.find({});
    res.json(allPositions);
});

app.post('/newOrder', async(req, res) => {
    let newOrder = new OrdersModel({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        mode: req.body.mode,
    });
    await newOrder.save();
    res.json({ message: 'Order created successfully' });

});




const MONGO_ATLAS_URL = 'mongodb+srv://zerodha:zerodha2025@cluster0.mongodb.net/zerodha?retryWrites=true&w=majority';

mongoose
  .connect(mongoUrl || MONGO_ATLAS_URL)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });