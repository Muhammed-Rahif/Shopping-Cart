var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID
var Promise = require('promise');
const bcrypt = require("bcryptjs");
const { reject, resolve } = require('promise');
const collections = require('../config/collections');
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
                email:'$2a$10$Wf0jWjnt0cMlPAzF2yfvUe4Yuxsa.J9Xhp1QEtAdmzOovOLA0G.16',
                password:'$2a$10$AkayNeMKYJcE2BHkaKaecOg/5oPrntmZ5YDOGvNrUerNp2pyPcNw2'
            }
            var adminDataExist=await db.get().collection(collection.ADMIN_COLLECTION).findOne({});
            if (adminDataExist) {
                    if (adminData.name===adminDataExist.name) {
                        bcrypt.compare(adminData.email, adminDataExist.email).then((status) => {
                            if (status) {
                                bcrypt.compare(adminData.password, adminDataExist.password).then((status) => {
                                    if (status) {
                                        resolve({loginStatus:true,admin:defAdmin})
                                    } else {
                                        resolve({loginStatus:false})
                                    }
                                })
                            } else {
                                resolve({loginStatus:false})
                            }
                        })
                    } else {
                        resolve({loginStatus:false})
                    }
            } else {
                db.get().collection(collection.ADMIN_COLLECTION).insertOne(defAdmin).then(async()=>{
                    db.get().collection(collection.ADMIN_COLLECTION).findOne({}).then((adminDataExist)=>{
                        console.log(adminDataExist);
                            if (adminData.name===adminDataExist.name) {
                                bcrypt.compare(adminData.email, adminDataExist.email).then((status) => {
                                    if (status) {
                                        bcrypt.compare(adminData.password, adminDataExist.password).then((status) => {
                                            if (status) {
                                                resolve({loginStatus:true,admin:defAdmin})
                                            } else {
                                                resolve({loginStatus:false})
                                            }
                                        })
                                    } else {
                                        resolve({loginStatus:false})
                                    }
                                })
                            } else {
                                resolve({loginStatus:false})
                            }
                    })
                })
            }
        })
    },
    getAllOrders:()=>{
        return new Promise(async(resolve,reject)=>{
            let orders=await db.get().collection(collection.ORDER_COLLECTION).find({}).toArray()
            resolve(orders)
        })
    },
    changeOrderStatus:(orderId,orderStatus)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
            {
                $set:{
                    status:orderStatus
                }
            }
            ).then((response)=>{
                resolve(orderStatus)
            })
            
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find({}).toArray()
            resolve(users)
        })
    },
    getUserOrders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userOrders=await db.get().collection(collection.ORDER_COLLECTION).find({userId:objectId(userId)}).toArray()
            resolve(userOrders)
        })
    },
    getUserData:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userData=await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)})
            resolve(userData);
        })
    }
}