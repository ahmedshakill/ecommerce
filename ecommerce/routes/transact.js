const Bank = require('../models/Bank');
const Order = require('../models/Order');
const axios = require('axios').default;
const ShopBank = require('../models/ShopBank');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');
const router = require('express').Router();

router.get('/', verifyToken, async (req, res, next) => {
  const userBankInfo = await Bank.findOne({ userId: req.user.id });
  //TODO
  // send userbankInfo to bank org while paying for products
  try {
    const result = await axios.request({
      method: req.body.method,
      url: 'http://localhost:5454/api/balance',
      data: {
        accountNumber: userBankInfo.accountNumber,
        secret: userBankInfo.secret,
      },
    });
    console.log(result.data);
    res.status(200).json(result.data);
  } catch (err) {
    res.status(400).json({ message: 'bank transaction error' });
  }
});

/*
router.post('/', verifyToken, async (req, res, next) => {
  const userBankInfo = await Bank.findOne({ userId: req.user.id });
  //TODO
  // send userbankInfo to bank org while paying for products
  try {
    const result = await axios.request({
      method: req.body.method,
      url: 'http://localhost:5454/api/balance',
      data: {
        accountNumber: userBankInfo.accountNumber,
        secret: userBankInfo.secret,
        balance: req.body.balance,
      },
    });
    console.log(result.data);
    res.status(200).json(result.data);
  } catch (err) {
    res.status(400).json({ message: 'bank transaction error' });
  }
});
*/

router.post('/', verifyToken, async (req, res, next) => {
  const userBankInfo = await Bank.findOne({ userId: req.user.id });
  const orderInfo = await Order.findOne({ userId: req.user.id });
  let shopBank = await ShopBank.find();
  shopBank = shopBank[0];
  //TODO
  // send userbankInfo to bank org while paying for products
  try {
    const result = await axios.request({
      method: 'post',
      url: 'http://localhost:5454/api/auth/login',
      data: {
        ecommerceAccountNumber: shopBank.accountNumber,
        accountNumber: userBankInfo.accountNumber,
        secret: userBankInfo.secret,
        balance: orderInfo.amount,
      },
    });
    console.log(shopBank);
    console.log(result.data);
    res.status(200).json(result.data);
  } catch (err) {
    res.status(400).json({ message: 'bank transaction error' });
  }
});

module.exports = router;
