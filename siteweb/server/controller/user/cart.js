const Cart = require('../../models/Cart')
const Product = require('../../models/Product')


function checkStock(item) {

    return new Promise((resolve) => {

        const itemDetail = {
            color: item.color,
            size: item.size
        }
    
        Product.findOne({_id: item.productId})
            .then(async(product) => {
    
                if (!product) return resolve(false)
    
                if (product.details.length == 0) {
    
                    if (product.stock >= item.quantity) {
    
                        //await Product.updateOne({_id: item._id}, {stock: product.stock - elem})
                        await Product.updateOne({_id: product._id}
                        , {$set: {"stock": product.stock - item.quantity}})
                      
                        return resolve(true)
    
                    } else return resolve(false)
                    
                }
    
                const elemsizecolor = product.details.find((detail) => detail.color == itemDetail.color && detail.size == itemDetail.size)

                if (elemsizecolor) {
                    if (elemsizecolor.stock >= item.quantity) {
    
                        console.log(elemsizecolor.stock)
                        console.log(item.quantity)
    
                        // update product quantity
                        await Product.updateOne({$and: [{_id: product._id}, {"details": {$elemMatch: {size: elemsizecolor.size, color: elemsizecolor.color}}}]}
                        , {$set: {"details.$.stock": elemsizecolor.stock - item.quantity, "stock": product.stock - item.quantity}})
                        
                        return resolve(true)
                        
                    } else return resolve(false)

                } else return resolve(false)
    
                    
    
            })

    })

    


}

function checkStockForUpdate(item, newQuantity) {

    return new Promise((resolve) => {

        const itemDetail = {
            color: item.color,
            size: item.size
        }
    
        Product.findOne({_id: item.productId})
            .then(async(product) => {
    
                if (!product) return resolve(false)
    
                if (product.details.length == 0) {
    
                    if (product.stock + item.quantity >= newQuantity) {
    
                        //await Product.updateOne({_id: item._id}, {stock: product.stock - elem})
                        await Product.updateOne({_id: product._id}
                        , {$set: {"stock": product.stock + item.quantity - newQuantity}})
                      
                        return resolve(true)
    
                    } else return resolve(false)
                    
                }
    
                const elemsizecolor = product.details.find((detail) => detail.color == itemDetail.color && detail.size == itemDetail.size)
    
                    if (elemsizecolor.stock + item.quantity >= newQuantity) {
    
                        console.log(elemsizecolor.stock)
                        console.log(item.quantity)
    
                        // update product quantity
                        await Product.updateOne({$and: [{_id: product._id}, {"details": {$elemMatch: {size: elemsizecolor.size, color: elemsizecolor.color}}}]}
                        , {$set: {"details.$.stock": elemsizecolor.stock + item.quantity - newQuantity, "stock": product.stock + item.quantity - newQuantity}})
                        
                        return resolve(true)
                        
                    } else return resolve(false)
    
            })

    })

    


}


exports.addItemToCart = async (req,res) => {

    const userId = req.body.userId

    let cartItem

    if (req.body.size && req.body.color) {

        cartItem = {
            productId: req.body.productId,
            quantity: req.body.quantity,
            size: req.body.size,
            color: req.body.color
        }

    } else if (req.body.size) {

        cartItem = {
            productId: req.body.productId,
            quantity: req.body.quantity,
            size: req.body.size
        }
    } else if (req.body.color) {

        cartItem = {
            productId: req.body.productId,
            quantity: req.body.quantity,
            color: req.body.color
        }

    } else {

        cartItem = {
            productId: req.body.productId,
            quantity: req.body.quantity
        }

    }

    
    const available = await checkStock(cartItem)

    if (available) {
        Cart.findOne({userId: userId})
        .then((cart) => {
            if (cart) {

                    const item = cart.cartItems.find((item) => (item.productId == cartItem.productId && item.size == cartItem.size && item.color == cartItem.color))

                    if (item) {  // item already exists in the cart


                        Cart.updateOne({cartItems: {$elemMatch: {_id: item._id}}}, {$set: {"cartItems.$.quantity": item.quantity + cartItem.quantity}})
                            .then((updatedItem) => {
                               return res.status(200).json({success: true})
                            })
                            .catch((error) => console.log(error))

                    } else {  // new item in cart

                        Cart.updateOne({_id: cart._id}, {$push: {cartItems: cartItem}})
                            .then((updatedItem) => {
                                return res.status(200).json({success: true})
                            })
                            .catch((error) => console.log(error))

                    } 
            } else {
                
                const cart = new Cart({
                    userId: userId,
                    cartItems: [cartItem]
                })

                cart.save((error, cart) => {
                    if (error) return res.status(400).json({error})
                    if (cart) return res.status(200).json({success: true})

                })
            }
        })
    } else return res.status(201).json({outofstock: true})

}


exports.updateItemCart = async (req, res) => {

    let cartItem
    let oldQuantity
    const newQuantity = req.body.quantity

    await Cart.findOne({userId: req.body.userId}) 
    .then((cart) => {

        const item = cart.cartItems.find((item) => (item._id == req.body.itemId))
        cartItem = item
        oldQuantity = item.quantity

    })
    .catch((error) => {
        return res.status(400).json({error})
    })



    const available = await checkStockForUpdate(cartItem, newQuantity)

    if (!available) return res.status(201).json({outofstock: true})


    Cart.updateOne({$and: [{userId: req.body.userId}, {"cartItems": {$elemMatch: {_id: cartItem._id}}}]}
        , {$set: {"cartItems.$.quantity": newQuantity}}) 
        .then((updatedItem) => {
            return res.status(200).json({success: true})
        })
        .catch((error) => console.log(error))

}

exports.getCartItems = (req, res) => {

    Cart.findOne({userId: req.body.userId})   
        .populate({path: 'cartItems.productId', select: '_id name description price stock productPictures details weight'})
        .then((cart) => {
            if (cart) return res.status(200).json({cart: cart.cartItems})
        })
        .catch((error) => console.log(error))

}

exports.deleteItemCart = async (req, res) => {

    let cartItem

    let itemsInCart

    await Cart.findOne({userId: req.body.userId}) 
    .then((cart) => {

        itemsInCart = cart.cartItems.length

        console.log('itemsInCart', itemsInCart)

        const item = cart.cartItems.find((item) => (item._id == req.body.itemId))
        cartItem = item

    })
    .catch((error) => {
        return res.status(400).json({error})
    })

    await Product.updateOne({$and: [{_id: cartItem.productId}, {"details": {$elemMatch: {size: cartItem.size, color: cartItem.color}}}]}
    , {$inc: {"details.$.stock": cartItem.quantity, "stock": cartItem.quantity}})
        .then((result) => {

            // now we can delete item from the cart

            // if it is the last item => delete the whole cart

            if (itemsInCart == 1) {

                Cart.findOneAndDelete
                ({userId: req.body.userId})
                .then((result) => res.status(200).json({success: true}))
                .catch((error) => res.status(400).json({error}))

            } else {

                Cart.updateOne({userId: req.body.userId}, {$pull: {
                    cartItems: {
                        _id: req.body.itemId
                    }
                }})
                .then((result) => res.status(200).json({success: true}))
                .catch((error) => res.status(400).json({error}))

            }


        })
        .catch((error) => {
            return res.status(400).json({error})
        })
    


}