var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET home page. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    console.log(products);
    res.render('admin/view-products', { products, admin: true });
  })
});
router.get('/add-product', (req, res) => {
  res.render('admin/add-product', { admin: true })
})
router.post('/add-product', (req, res) => {
  productHelpers.addProduct(req.body).then((id) => {
    let image = req.files.image
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/add-product', { admin: true })
      } else {
        console.log(err);
      }
    })
  })
})
router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id;
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/')
  })
})
router.get('/edit-product/:id', (req, res) => {
  productHelpers.getProductDetails(req.params.id).then((product) => {
    res.render('admin/edit-product', { admin: true, product })
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

module.exports = router;
