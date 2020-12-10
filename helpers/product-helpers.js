var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID
module.exports={
    addProduct:(product)=>{
        product.price=parseInt(product.price)
        console.log(product);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
                resolve(data.ops[0]._id)
            })
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({}).toArray()
            resolve(products)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    }
}