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
  let cartCount=null;
  if(req.session.user) {
    await userHelpers.getCartCount(req.session.user._id).then((count)=>{
      cartCount=count;
    })
    
  }
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user , cartCount})
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
router.get('/cart', verifyLogin, (req, res) => {
  let user = req.session.user
   userHelpers.getCartProducts(req.session.user._id).then((products)=>{
    res.render('user/cart', { user , products })
  })
})
router.get('/add-to-cart/:id',(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})

module.exports = router;