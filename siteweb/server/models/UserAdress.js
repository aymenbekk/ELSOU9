const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  addressLine: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 100,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  secondPhone: {
    type: String,
  },
});


const userAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    address: [addressSchema],
  },
  { timestamps: true }
);

mongoose.model("Address", addressSchema);
module.exports = mongoose.model("UserAddress", userAddressSchema);