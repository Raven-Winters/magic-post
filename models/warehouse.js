const mongoose = require('mongoose');
const Package = require('./package');
const Store = require('./store');
const Schema = mongoose.Schema;

const WarehouseSchema = new Schema({
    // manager: {
    //     name: {
    //         type: String,
    //         required: [true, "Please enter Manager's name"],
    //     },
    // },

    province: {
        type: String,
        required: [true, "Please enter Warehouse's province"],
        unique: [true, "Warehouse already exists"]
    },

    packages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Package'
        }
    ],

    stores: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Store'
        }
    ],

    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }
})

WarehouseSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Package.deleteMany({
            _id: {
                $in: doc.packages,
            }
        })

        await Store.deleteMany({
            _id: {
                $in: doc.stores,
            }
        })
    }
})

module.exports = mongoose.model('Warehouse', WarehouseSchema);