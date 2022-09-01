const Bank = require('../models/ShopBank');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();

router.post('/', verifyTokenAndAdmin, async (req, res) => {
  console.log(req.user);
  const newBankInfo = new Bank({
    accountNumber: req.body.accountNumber,
    secret: req.body.secret,
  });
  try {
    const savedBank = await newBankInfo.save();
    res.status(200).json(savedBank);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
