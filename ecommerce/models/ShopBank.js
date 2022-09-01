const mongoose = require('mongoose');

const ShopBankSchema = new mongoose.Schema(
  {
    accountNumber: { type: String, required: true, unique: true },
    secret: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShopBank', ShopBankSchema);
