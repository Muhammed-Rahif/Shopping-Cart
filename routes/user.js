var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{ products })
  })
});

module.exports = router ;