const router = require('express').Router();
const User = require('../models/User');
const Account = require('../models/Account');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./verifyToken');

router.post('/ecommerce', async (req, res, next) => {
  try {
    const accountNumber = req.body.accountNumber;
    const ecommerceAccountNumber = req.body.ecommerceAccountNumber;
    const secret = req.body.secret;
    const balance = req.body.balance;
    const accountInfo = await Account.findOne({ accountNumber: accountNumber });
    if (secret === accountInfo.secret) {
      accountInfo.balance = accountInfo.balance - balance;
    }
    const savedAccount = await Account.findOneAndUpdate(
      {
        accountNumber: accountNumber,
      },
      { balance: accountInfo.balance },
      { new: true }
    );
    res.status(200).json(savedAccount);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
