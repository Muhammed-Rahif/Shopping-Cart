var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"I phone 11",
      catogory:"Mobile",
      discription:"This is I phone",
      price:"60000",
      image:"https://images-na.ssl-images-amazon.com/images/I/71i2XhHU3pL._SL1500_.jpg"
    },
    {
      name:"Realme",
      catogory:"Mobile",
      discription:"This is Realme",
      price:"60000",
      image:"https://images-na.ssl-images-amazon.com/images/I/71i2XhHU3pL._SL1500_.jpg"
    },
    {
      name:"Samsung",
      catogory:"Mobile",
      discription:"This is Samsung",
      price:"60000",
      image:"https://images-na.ssl-images-amazon.com/images/I/71i2XhHU3pL._SL1500_.jpg"
    },
    {
      name:"Lonevo",
      catogory:"Mobile",
      discription:"This is Lonevo",
      price:"60000",
      image:"https://images-na.ssl-images-amazon.com/images/I/71i2XhHU3pL._SL1500_.jpg"
    }
  ]
  res.render('admin/view-products', { products,admin:true });
});
router.get('/add-product',(req,res)=>{
  res.render('admin/add-product', { admin:true })
})
router.post('/add-product',(req,res)=>{
  productHelpers.addProduct(req.body).then((id)=>{
    let image=req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if (!err) {
        res.render('admin/add-product', { admin:true })
      }else{
        console.log(err);
      }
    })
  })
})

module.exports = router;
