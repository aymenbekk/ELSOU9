const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true 
    },
    cartItems: [{
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'product',
                required: true 
            },
            quantity: { 
                type: Number, 
                default: 1 ,
                required: true
            },
            color: {
                type: String,
            },
            size: {
                type: String,
                enum: ["S", "M", "L", "XL", "XXL", "XS"]
            }        
                
        }]
}, { timestamps: true });


module.exports = mongoose.model('Cart', cartSchema);