const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({

    district: {
        type: String,
        required: [true, "Please enter Store's district"],
        unique: [true, "Store already exists"]
    },

    address: {
        type: String,
        required: [true, "Please enter Store's address"],
        unique: [true, "Store already exists"]
    },

    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }

})


module.exports = mongoose.model('Store', storeSchema);