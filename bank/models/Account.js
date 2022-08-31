const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    accountNumber: { type: String, required: true, unique: true },
    secret: { type: String, required: true },
    balance: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', AccountSchema);
