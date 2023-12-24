const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({

    name: {
        type: String,
        required: [true, "Please enter Package's name"]
    },

    weight: {
        type: Number,
        required: [true, "Please enter Package's weight"]
    },

    fee: {
        type: Number,
        required: [true, "Please enter Package's fee"]
    },

    note: {
        type: String,
        required: false
    },

    state: {
        type: String,
        enum: ["Arrived at sender's store", "Delivering to sender's warehouse", "Arrived at sender's warehouse", "Delivering to receiver's warehouse",
            "Arrived at receiver's warehouse", "Delivered to receiver's store", "Completed"],
        //1: Arrived at sender's store
        //2: Delivering to sender's warehouse
        //3: Arrived at sender's warehouse
        //4: Delivering to receiver's warehouse
        //5: Arrived at receiver's warehouse
        //6: Delivered to receiver's store
        //7: Completed
        required: true
    },

    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager'
    }

    // senderWarehouse: {
    //     type: String,
    //     required: true
    // },

    // receiverWarehouse: {
    //     type: String,
    //     required: true
    // }

})


module.exports = mongoose.model('Package', packageSchema);