const Bank = require('../models/Bank');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();

router.post('/', verifyToken, async (req, res) => {
  console.log(req.user);
  const newBank = new Bank({
    userId: req.user.id,
    accountNumber: req.body.accountNumber,
    secret: req.body.secret,
  });
  try {
    const savedBank = await newBank.save();
    res.status(200).json(savedBank);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
