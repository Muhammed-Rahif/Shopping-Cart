const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* GET users listing. */
router.get('/', async function (req, res, next) {
  let user = req.session.user
  let cartCount = null;
  if (req.session.user) {
    await userHelpers.getCartCount(req.session.user._id).then((count) => {
      cartCount = count;
    })

  }
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user, cartCount })
  })
});
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login-page', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})
router.get('/signup', (req, res) => {
  res.render('user/signup-page')
})
router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((data) => {
    req.session.loggedIn = true
    req.session.user = data
    res.redirect('/')
  })
})
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid email or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart', verifyLogin, async(req, res) => {
  let user = req.session.user
  let totalValue =await userHelpers.getTotalAmount(req.session.user._id)
  console.log(totalValue);
  userHelpers.getCartProducts(req.session.user._id).then((products) => {
    res.render('user/cart', { user, products ,totalValue })
  })
})
router.get('/add-to-cart/:id', (req, res) => {
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({ status: true })
  })
})
router.post('/change-product-quantity', (req, res, next) => {
  userHelpers.changeProductQuantity(req.body).then(async(response) => {
    response.total=await userHelpers.getTotalAmount(req.body.user)
    res.json(response)
  })
})
router.post('/delete-product', (req, res) => {
  console.log(req.body);
  userHelpers.deleteCartProduct(req.body).then((response) => {
    res.json(response)
  })
})
router.get('/place-order', verifyLogin, async(req, res) => {
  let user = req.session.user
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order', { user , total })
})

module.exports = router;