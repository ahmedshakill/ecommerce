const router = require('express').Router();
const User = require('../models/User');
const Account = require('../models/Account');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./verifyToken');

router.post('/ecommerce', async (req, res, next) => {
  console.log('transfer ecommerce');
  try {
    const accountNumber = req.body.accountNumber;
    const ecommerceAccountNumber = req.body.ecommerceAccountNumber;
    const secret = req.body.secret;
    const balance = req.body.balance;
    console.log(ecommerceAccountNumber);
    const accountInfo = await Account.findOne({ accountNumber: accountNumber });
    console.log(accountInfo);
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
    console.log('saved user' + savedAccount);
    const ecommerceAccount = await Account.findOne({
      accountNumber: ecommerceAccountNumber,
    });
    console.log('ecoacc' + ecommerceAccount);
    ecommerceAccount.balance = ecommerceAccount.balance + balance;
    const savedecommerceAccount = await Account.findOneAndUpdate(
      {
        accountNumber: ecommerceAccountNumber,
      },
      {
        balance: ecommerceAccount.balance,
      },
      { new: true }
    );

    console.log(savedecommerceAccount);
    res.status(200).json({ savedecommerceAccount });
  } catch (err) {
    res.status(500).json(err);
  }
});

//ecommerce to supplier
router.post('/supplier', async (req, res, next) => {
  console.log('transfer ecommerce');
  try {
    const accountNumber = req.body.accountNumber;
    const ecommerceAccountNumber = req.body.ecommerceAccountNumber;
    const secret = req.body.secret;
    const balance = req.body.balance;
    console.log(ecommerceAccountNumber);
    const accountInfo = await Account.findOne({ accountNumber: accountNumber });
    console.log(accountInfo);
    if (secret === accountInfo.secret) {
      accountInfo.balance = accountInfo.balance + balance;
    }
    const savedAccount = await Account.findOneAndUpdate(
      {
        accountNumber: accountNumber,
      },
      { balance: accountInfo.balance },
      { new: true }
    );
    console.log('saved user' + savedAccount);
    const ecommerceAccount = await Account.findOne({
      accountNumber: ecommerceAccountNumber,
    });
    console.log('ecoacc' + ecommerceAccount);
    ecommerceAccount.balance = ecommerceAccount.balance - balance;
    const savedecommerceAccount = await Account.findOneAndUpdate(
      {
        accountNumber: ecommerceAccountNumber,
      },
      {
        balance: ecommerceAccount.balance,
      },
      { new: true }
    );

    console.log(savedecommerceAccount);
    res.status(200).json({ savedecommerceAccount });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
