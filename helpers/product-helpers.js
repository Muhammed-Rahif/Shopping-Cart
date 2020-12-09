var db = require('../config/connection')
var collection = require('../config/collections')

module.exports={
    addProduct:(product)=>{
        product.price=parseInt(product.price)
        console.log(product);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
                resolve(data.ops[0]._id)
            })
        })
    }
}