const Product = require('../models/product');
const axios = require('axios');
const crypto = require('crypto');

///******PRODUCT DELIVERY REQUEST TO THE SELLER */

exports.placeOrder = async (req, res, next) => {
  const transaction_id = req.body.transaction_id;

  // const products = req.body.products;
  // console.log("products", products);
  let total = Number(req.body.total);
  console.log(total);
  // const buyer_acc = req.body.buyer_account;
  //const seller_acc = req.body.seller_account;

  try {
    /** Requesting from SELLER API TO The (BANK API)  with the Transaction ID
     * to confirm the Payment of the users */
    const res1 = await axios.post(
      'http://localhost:8000/transaction_confirmation',
      {
        transaction_id: transaction_id,
      }
    );
    console.log(res1.data);
    console.log(res1.data.deatail.transfer_amount, total);
    ///Compare If the total money is Right
    if (
      res1.data.status === 'success' &&
      res1.data.deatail.transfer_amount === total
    ) {
      res.send({
        status: 'success',
        message: ' Product is being Sent to the User',
        transaction_details: res1.data.deatail,
      });
    } else {
      res.send({
        status: 'failure',
        message: 'Transaction Confirmation Failed',
      });
    }
  } catch (err) {
    return res.send(200, { status: 'failure' });
  }
};

exports.addProd = async (req, res, next) => {
  try {
    const result = await axios.request({
      method: 'post',
      url: 'http://localhost:4343/api/auth/login',
      data: {
        user_name: 'supplier',
        password: '999999999',
      },
    });
    res.status(200).json(result.data);
  } catch (err) {
    res.send({ err: 'err' });
  }
};
