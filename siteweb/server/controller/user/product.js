const Product = require('../../models/Product')
const Cart = require('../../models/Cart')
const Category = require('../../models/Category')

exports.addProduct = async(req, res) => {

    try {

        console.log(req.body)

        const {name, description, price, categoryId, stock, productPictures, visible, weight, details, topProduit} = req.body
   
        const product = new Product({name, description, price, categoryId, stock, productPictures, visible, weight, details, topProduit})

        const result = await product.save()

        res.status(200).json({product: result})

    } catch (error) {
        

        
        return res.status(500).json({error})
    }

}

exports.getProductsByCategory = async (req, res) => {

    const categoryId = req.params.id

    // //if category if parent we need all products of the children
    // const cat = Category.findOne({_id: categoryId})

    // if (!cat.parentId) {  // is a parent



    // }

    Product.find({$and: [{categoryId: categoryId}, {visible: true}]})
        .then((products) => {
            console.log(products)
            if (products) return res.status(200).json({products: products})
        })
        .catch((error) => {
            return res.status(400).json({error: error})
        })
}

exports.getAllProducts = (req, res) => {

    Product.find({visible: true})
        .populate('categoryId')
        .then((products) => {
            if (products) return res.status(200).json({products})
        })
        .catch((error) => { return res.status(400).json({error})})
}

exports.getNewestProducts = (req, res) => {

    Product.find({visible: true}).sort({_id: -1}).populate('categoryId')
        .then((products) => {
            return res.status(200).json({products})
        })
        .catch((error) => {
            return res.status(400).json({error})
        })


}

exports.getTopProducts = (req, res) => {

    Product.find({$and: [{topProduit: 1}, {visible: true}]})
        .then((products) => {
            return res.status(200).json({products})
        })
        .catch((error) => {
            return res.status(400).json({error})
        })

}

exports.getProductDetails = async (req, res) => {

    try {

        const product = await Product.findOne({_id: req.params.id})
            .populate('reviews.userId')
            .populate('categoryId')
        if (product) return res.status(200).json({product})

    } catch(error) {
        return res.status(400).json({error})
    }
}

exports.deleteProduct = async (req, res) => {

    
        await Product.deleteOne({_id: req.body._id})

        // delete product from carts
        await Cart.updateMany({cartItems: {$elemMatch: {productId: req.body._id}}}, {$pull: {
            cartItems: {
                productId: req.body._id
            }
        }})

    return res.status(200).json({success:true})
   
}

exports.addReview = async (req, res) => {

    try {

        const userId =  req.body.userId
        const review = req.body.review
        const stars = req.body.stars

        await Product.updateOne({_id: req.body.productId}, {$push: {reviews: {userId, review, stars}}})
        return res.status(200).json({success: true})

    } catch(err){
        return res.status(400).json({error: "Error while adding review"})
    } 
   
}

exports.updateProductVisibile = async (req, res) => {

    await Product.updateOne({_id: req.body.productId}, {visible: req.body.visible})

    { /*   
    // delete product from carts
    await Cart.updateMany({cartItems: {$elemMatch: {productId: req.body.productId}}}, {$pull: {
        cartItems: {
            productId: req.body.productId
        }
    }})
    */}

    return res.status(200).json({success:true})
       
}

exports.updateProduct = async (req, res) => {

    const {name, description, price, categoryId, stock, productPictures, visible, weight, details, topProduit} = req.body.submitPorodcut
    const productId = req.body.productId

    Product.updateOne({_id: productId}, {name, description, price, categoryId, stock, productPictures, visible, weight, details, topProduit})
        .then((result) => {
            return res.status(200).json({updated: true})
        })
        .catch((error) => {
            return res.status(400).json({error})
        })

}