const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    stock: {
        type: Number
    },
    details: [{
        color:{
            type: String,
        },
        size: {
            type: String,
            enum: ["S", "M", "L", "XL", "XXL", "XS"] 
        },
        stock: {
            type: Number
        }
    }],
    weight: {
        type: Number,
        required: true
    },
    productPictures: [{ 
        img: { 
            type: String 
        } ,
        public_id: {
            type: String
        }
    }],
    reviews: [
        {   
            userId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'user'
            },
            review: String,
            stars: Number
        }
    ],
    visible: {
        type: Boolean,
        default: true
    },
    topProduit: {
        type: Number,
        enum: [0, 1]
    }

})

module.exports = Product = mongoose.model('product', productSchema);