var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID
var Promise = require('promise');
const { reject } = require('promise');
module.exports = {
    addProduct: (product) => {
        product.price = parseInt(product.price)
        console.log(product);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
                resolve(data.ops[0]._id)
            })
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find({}).toArray()
            resolve(products)
        })
    },
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId(proId) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,product)=>{
        product.price = parseInt(product.price)
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    name:product.name,
                    discription:product.discription,
                    price:product.price,
                    category:product.category
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            const defAdmin={
                name:"Muhammed Rahif",
                email:'rahifpalliyalil@gmail.com',
                password:'1234'
            }
            let adminDataExist=await db.get().collection(collection.ADMIN_COLLECTION).findOne({})
            if (adminDataExist) {
                if (adminData.email===adminDataExist.email) {
                    if (adminData.password===adminDataExist.password) {
                        resolve({loginStatus:true,admin:defAdmin})
                    } else {
                        resolve({loginStatus:false})
                    }
                } else {
                    resolve({loginStatus:false})
                }
            } else {
                db.get().collection(collection.ADMIN_COLLECTION).insertOne(defAdmin)
                if (adminData.email===adminDataExist.email) {
                    if (adminData.password===adminDataExist.password) {
                        resolve({loginStatus:true})
                    } else {
                        resolve({loginStatus:false})
                    }
                } else {
                    resolve({loginStatus:false})
                }
            }
        })
    }
}