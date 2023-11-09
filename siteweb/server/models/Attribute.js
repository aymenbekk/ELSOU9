const mongoose = require("mongoose");

const AttributeSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    dataList: [{
        type: String
    }]

})    

module.exports = mongoose.model('attirube', AttributeSchema);