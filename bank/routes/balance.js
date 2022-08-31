const router = require('express').Router();
const User = require('../models/User');
const Account = require('../models/Account');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./verifyToken');

router.get('/', async (req, res, next) => {
  try {
    const accountNumber = req.body.accountNumber;
    const secret = req.body.secret;
    const accountInfo = await Account.findOne({ accountNumber: accountNumber });
    if (secret === accountInfo.secret) {
      res.status(200).json(accountInfo);
    } else {
      res.status(401).json({ message: 'authentication failure' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const accountNumber = req.body.accountNumber;
    const secret = req.body.secret;
    const balance = req.body.balance;
    const accountInfo = await Account.findOne({ accountNumber: accountNumber });
    if (secret === accountInfo.secret) {
      accountInfo.balance = accountInfo.balance + balance;
    }
    const savedAccount = await accountInfo.save();
    res.status(200).json(savedAccount);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const accountNumber = req.body.accountNumber;
    const secret = req.body.secret;
    const balance = req.body.balance;
    const accountInfo = await Account.findOne({ accountNumber: accountNumber });
    if (secret === accountInfo.secret) {
      accountInfo.balance = accountInfo.balance - balance;
    }
    const savedAccount = await accountInfo.save();
    res.status(200).json(savedAccount);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
