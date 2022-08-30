const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');
const router = require('express').Router();

router.post('/', verifyToken, (req, res, next) => {});

module.exports = router;
