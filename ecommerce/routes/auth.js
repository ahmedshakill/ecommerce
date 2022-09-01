const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//REGISTER
router.post('/register', async (req, res) => {
  // console.log(req.body.password);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post('/login', async (req, res) => {
  // {
  //    userName : req.body.user_name,
  // }
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
