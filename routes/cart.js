const Cart = require('../models/Cart');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();

//CREATE

router.post('/', verifyToken, async (req, res) => {
  // const newCart = new Cart(req.body);
  let products = req.body.products;

  const newCart = new Cart({
    userId: req.user.id,
    products: req.body.products,
  });
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findOne({ userId: req.user.id });
    // updatedCart.products.forEach((element) => {
    //   products.forEach((prodNew) => {
    //     if (element.productId === prodNew.productId) {
    //       element.quantity = element.quantity + prodNew.quantity;
    //     }
    //   });
    // });
    let contains = false;
    updatedCart.products.forEach((element) => {
      if (element.productId === req.params.id) {
        element.quantity = element.quantity + 1;
        contains = true;
      }
    });
    if (!contains) {
      updatedCart.products.push({ productId: req.params.id, quantity: 1 });
    }
    const updatedCart2 = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: updatedCart.userId,
        products: updatedCart.products,
      },
      { new: true }
    );
    res.status(200).json(updatedCart2);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    // await Cart.findByIdAndDelete(req.params.id);
    const updatedCart = await Cart.findOne({ userId: req.user.id });
    let onlyOneLeft = false;
    updatedCart.products.forEach((element) => {
      if (element.productId === req.params.id) {
        if (element.quantity === 1) {
          onlyOneLeft = true;
        } else element.quantity = element.quantity - 1;
      }
    });
    if (onlyOneLeft) {
      updatedCart.products.splice(
        updatedCart.products.findIndex((element) => {
          element.productId === req.params.id;
        }),
        1
      );
    }
    const updatedCart2 = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: updatedCart.userId,
        products: updatedCart.products,
      },
      { new: true }
    );
    res.status(200).json(updatedCart2);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get('/', verifyToken, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
