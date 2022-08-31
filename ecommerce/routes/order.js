const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();

//CREATE

async function calculateAmount(cart) {
  // let amount = 0;
  const products = cart.products;
  const totalAmount = await products.reduce(async (promisedAmount, prod) => {
    // console.log(prod.productId);
    const prodObj = await Product.findById(prod.productId);
    // console.log('prodObj ' + prodObj);
    let amount = await promisedAmount;
    amount = amount + prodObj.price * prod.quantity;
    // console.log('amount=' + amount);
    return amount;
  }, 0);

  // console.log('totalAmount=' + totalAmount);
  return totalAmount;
}

router.post('/', verifyToken, async (req, res) => {
  // const newOrder = new Order(req.body);

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    const amount = await calculateAmount(cart);
    // console.log(cart + ' \n' + amount);

    const oldOrder = await Order.findOne({ userId: req.user.id });
    console.log(oldOrder);
    if (oldOrder === null) {
      const newOrder = new Order({
        userId: req.user.id,
        products: cart.products,
        amount: amount,
        address: 'bujhlam kisu akta', //req.body.address,
      });
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } else {
      const newOrder = new Order({
        userId: req.user.id,
        products: cart.products,
        amount: amount,
        address: 'bujhlam kisu akta',
      });
      const savedOrder = await Order.findOneAndUpdate(
        { userId: req.user.id },
        {
          products: cart.products,
          amount: amount,
        },
        { new: true }
      );
      res.status(200).json(savedOrder);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json('Order has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
