const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    shippingDetails: {

      firstName: {
        type: String,
        required: true

      },
      lastName: {
        type: String,
        required: true

      },
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
        required: true,
      },
      address: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true,
      }
      
    },
    orderItems: [
      {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      picture: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: String
      },
      color: {
        type: String
      },
      payablePrice: {
        type: Number,
        required: true,
      }
    }],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
    },
    paymentMethodType: {
      type: String,
      enum: ["paypal", "card"],
      required: true,
    },
    orderStatus: 
      {
        type: {
          type: String,
          default: "Commandé",
        },
        date: {
          type: Date,
        },

      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);