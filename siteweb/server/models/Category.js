const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
    }
})

module.exports = Category = mongoose.model('category', categorySchema)