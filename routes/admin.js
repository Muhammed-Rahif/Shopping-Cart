var express = require('express');
var router = express.Router();

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
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  console.log(req.body);
  console.log(req.files.image);

})

module.exports = router;
