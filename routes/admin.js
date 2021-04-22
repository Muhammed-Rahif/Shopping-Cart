var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var fs = require('fs');

const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}
/* GET home page. */
router.get('/', verifyLogin, function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    let admin = req.session.admin
    res.render('admin/view-products', { products, admin });
  })
});
router.get('/add-product', verifyLogin, (req, res) => {
  let admin = req.session.admin
  res.render('admin/add-product', { admin })
})
router.post('/add-product', (req, res) => {
  productHelpers.addProduct(req.body).then((id) => {
    let image = req.files.image
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        let admin = req.session.admin
        res.render('admin/add-product', { admin, proAdded: "Product added successfully..!" })
      } else {
        console.log(err);
      }
    })
  })
})
router.get('/delete-product/:id', verifyLogin, (req, res) => {
  let proId = req.params.id;

  // deleting image file
  fs.unlink('./public/product-images/' + proId + '.jpg', function (err) {
    if (err) throw err;
    console.log('File deleted!');
  });

  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/')
  })
})
router.get('/edit-product/:id', verifyLogin, (req, res) => {
  productHelpers.getProductDetails(req.params.id).then((product) => {
    let admin = req.session.admin;
    console.log(product);
    console.log(admin);
    res.render('admin/edit-product', { admin, product })
  })
})
router.post('/edit-product/:id', (req, res) => {
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files.image) {
      let image = req.files.image
      image.mv('./public/product-images/' + req.params.id + '.jpg')
    }
  })
})
router.get('/login', (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect('/admin')
  } else {
    res.render('admin/login-page', { "loginErr": req.session.adminLoginErr, admin: true })
    req.session.adminLoginErr = false
  }
})
router.post('/login', (req, res) => {
  productHelpers.doLogin(req.body).then((response) => {
    if (response.loginStatus) {
      req.session.admin = response.admin
      req.session.adminLoggedIn = true
      res.redirect('/admin')
    } else {
      req.session.adminLoginErr = "Invalid email or password"
      res.redirect('/admin/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.admin = null
  req.session.adminLoggedIn = false
  res.redirect('/admin')
})
router.get('/all-orders', verifyLogin, (req, res) => {
  let admin = req.session.admin;
  productHelpers.getAllOrders().then((orders) => {
    console.log(orders);
    res.render('admin/all-orders', { admin, orders })
  })
})
router.post('/change-order-status', (req, res) => {
  console.log(req.body);
  productHelpers.changeOrderStatus(req.body.orderId, req.body.orderStatus).then((orderStatus) => {
    console.log(orderStatus);
    res.json({ orderStatus })
  })
})
router.get('/all-users', verifyLogin, async (req, res) => {
  let admin = req.session.admin;
  let users = await productHelpers.getAllUsers()
  res.render('admin/all-users', { users, admin })
})
router.get('/view-user-orders/:id', verifyLogin, async (req, res) => {
  let admin = req.session.admin;
  let userOrders = await productHelpers.getUserOrders(req.params.id)
  let userData = await productHelpers.getUserData(req.params.id)
  res.render('admin/user-orders', { admin, userOrders, userData })
})


module.exports = router;
