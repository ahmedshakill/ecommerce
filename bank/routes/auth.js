const router = require('express').Router();
const User = require('../models/User');
const Account = require('../models/Account');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//REGISTER
router.post('/register', async (req, res) => {
  const accountNumber = crypto.randomInt(1000000000, 100000000000);
  const secret = crypto.randomInt(1000000000, 100000000000);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    accountNumber: accountNumber,
    secret: secret,
  });

  try {
    const savedUser = await newUser.save();

    const account = new Account({
      userID: savedUser._id,
      accountNumber,
      secret,
      balance: 20000,
    });
    const savedAccount = await account.save();
    res.status(201).json(savedAccount);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post('/login', async (req, res) => {
  // {
  //    userName : req.body.user_name,
  // }
  console.log('bank loging here');
  try {
    let exists = false;
    let matched = false;
    const users = await User.find();

    users.forEach((user) => {
      if (user.username === req.body.username) {
        exists = true;
        console.log(user);
        const hashedPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC
        );
        console.log('username ' + `${req.body.username}`);

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        if (originalPassword === inputPassword) {
          // res.status(401).json('Wrong Password');
          matched = true;
          console.log(originalPassword + ' ' + inputPassword);
          const accessToken = jwt.sign(
            {
              id: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '3d' }
          );
          const { password, ...others } = user._doc;
          res.status(200).json({ ...others, accessToken });
        }
      }
    });
    if ((exists === false) | (matched === false)) {
      res.status(401).json('Wrong credentials');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
