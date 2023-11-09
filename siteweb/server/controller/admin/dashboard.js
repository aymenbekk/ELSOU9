const {User} = require('../../models/User')
const Order = require('../../models/Order')
const Product = require('../../models/Product')


exports.dashboardStatistics = async (req, res) => {

    try {

        let paypalRevenue = 0
        let cardRevenue = 0
        let paypalNb = 0
        let cardNb = 0

        const usersNb = await User.find({role: 'user'}).count()
        const productsNb = await Product.find({}).count()
        const ordersNb = await Order.find({}).count()
        const revenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total_count: {
                        $sum: '$totalAmount'
                    }
                }
            },
            {"$unset": ['_id']}
        ])

        await Order.find({paymentMethodType: 'paypal'})
            .then((orders) => {
                orders.forEach((order) => {

                    paypalNb = paypalNb + 1
                    paypalRevenue = paypalRevenue + order.totalAmount
                })
            })
        
        await Order.find({paymentMethodType: 'card'})
            .then((orders) => {
                orders.forEach((order) => {

                    cardNb = cardNb + 1
                    cardRevenue = cardRevenue + order.totalAmount
                })
            })
    
        
        // const paypalNb = await Order.find({paymentMethodType: 'paypal'}).count()
        // const cardNb = await Order.find({paymentMethodType: 'card'}).count()
        const products = await Product.find({stock: 0}).populate('categoryId')
        
        return res.status(200).json({usersNb, productsNb, ordersNb, revenue, paypalNb, cardNb, paypalRevenue, cardRevenue, products})
    } catch(error) {
        return res.status(400).json({error})
    }


}