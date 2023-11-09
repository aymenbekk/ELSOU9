
const mongoose = require("mongoose");


const ShippingSchema = new mongoose.Schema({
    
    country: {
        type: String,
        required: true
    },
    days: {
        type: Number,
        require: true
    },
    prices: [{

        weight: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
 });

module.exports = mongoose.model('shipping', ShippingSchema);