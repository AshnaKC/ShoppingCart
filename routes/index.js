var express = require('express');
var Cart = require('../models/cart');
var router = express.Router();
var Product = require('../models/product');
router.get('/', function(req, res, next) {
  Product.find(function(err,docs){
    var productChunks =[]
    var chunkSize = 3;
    for (var i = 0; i<docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i,i + chunkSize));
    }
  res.render('shop/index', { title: 'Shopping Cart',products: productChunks });
});
});

router.get('/add-to-cart/:id',function(req,res){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  Product.findById(productId,function(err,product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product,product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});
router.get('/shopping-cart', function(req,res,next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products:cart.generateArray(), totalPrice:cart.totalPrice});
});
router.get('/checkout',function(req,res,next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout',{total:cart.totalPrice,errMsg:errMsg,noError:!errMsg})
});
router.post('/checkout',function(req,res,next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var stripe = require('stripe')('sk_test_51JnCM5SJ5ms2rFRpjJQKOxEt7HlHS0jEFoXxkPwj9mtt5teby9vleibbPgCQ5piNxzSqGQfXjLtB7zj1qpcm99ft00o0e6BPo3');
  var charge = stripe.charges.create({
    amount: cart.totalPrice,
    currency: 'usd',
    source: req.body.stripeToken,
    description: 'My First Test Charge (created for API docs)',
  }, function (err,charge) {
    if (err) {
      req.flash('error',err.message);
      return res.redirect('/checkout');
    }
    req.flash('success','Successfully bought product!');
    req.cart = null;
    res.redirect('/');
  })
});
module.exports = router;
