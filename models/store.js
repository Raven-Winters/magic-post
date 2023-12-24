const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({

    district: {
        type: String,
        required: [true, "Please enter Store's district"],
        unique: [true, "Store already exists"]
    },

})


module.exports = mongoose.model('Store', storeSchema);