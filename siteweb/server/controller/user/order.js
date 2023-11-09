const Order = require('../../models/Order')
const Cart = require('../../models/Cart')


// addOrder will be used in stripe (after the payment done successfully)

function getOrderItems(cartItems) {
    return new Promise((resolve) => {
        
        let orderItems = []

        for (var i = 0; i < cartItems.length; i++) {

            const item = cartItems[i]
            
            orderItems.push({
                productId: item.productId,
                name: item.productId.name,
                price: item.productId.price,
                picture: item.productId.productPictures[0].img,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                payablePrice : (item.quantity * item.productId.price).toFixed(2)

            }) 

            if (i == cartItems.length - 1) return resolve({orderItems})


        }
    })
}

exports.addOrder = (req, res) => {

    Cart.findOne({userId: req.body.userId}).populate('cartItems.productId')
        .then( async (cart) => {

            const shippingDetails = req.body.shippingDetails
            const paymentMethodType = req.body.paymentType
            const totalAmount = req.body.totalAmount

            const userId = cart.userId
            const paymentStatus = "completed"
            const orderStatus = {
                type: "Commandé",
                date: new Date()
            }

            const orderItemsAndTotal = await getOrderItems(cart.cartItems)

            console.log(orderItemsAndTotal)

            const orderItems = orderItemsAndTotal.orderItems

            const order = new Order({
                userId,
                shippingDetails,
                orderItems,
                totalAmount,
                paymentStatus,
                paymentMethodType,
                orderStatus
            })

            order.save()
                .then(async (order) => {
                    await Cart.deleteOne({userId: req.body.userId})
                    return res.status(200).json({order})
                })
                .catch((error) => {
                    console.log(error)
                    return res.status(400).json({error})
                })

        })
        .catch((error) => {
            return res.status(400).json({error})
        })

}

exports.getOrders = (req, res) => {

    Order.find({}).select('_id orderStatus paymentStatus totalAmount').sort({_id: -1})
        .then((orders) => {
            return res.status(200).json({orders})
        })
        .catch((error) => {
            return res.status(400).json({error})
        })

}

exports.getOrder = (req, res) => {

    Order.findOne({_id: req.params.id})
        .populate('userId')
        .populate('orderItems.productId')
        .then( async (order) => {
            if (order) {
                // get position
                const position = await Order.find({_id: {$lte: req.params.id}}).count()
                return res.status(200).json({order, position})
            }
        })
        .catch((error) => {
            return res.status(400).json({error})
        })
}

exports.editOrder = (req, res) => {


    Order.updateOne({_id: req.body.orderId}, {$set: {'orderStatus.type': req.body.status}})
        .then((result) => {
            return res.status(200).json({success: true})
        })
        .catch((error) => {
            return res.status(400).json({error})
        })  
    
}

exports.getUserOrders = async (req, res) => {

    try {

        const orders = await Order.find({userId: req.body.userId}).select('_id orderStatus paymentStatus totalAmount').sort({_id: -1})

        return res.status(200).json({orders})

    } catch(error) {
        return res.status(400).json({error})
    }

}
