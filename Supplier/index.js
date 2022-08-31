const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const sellerRoutes = require('./routes/seller');
const cors = require('cors');
app.use(sellerRoutes);
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 5000, () => {
  console.log('Backend server is running!');
});
