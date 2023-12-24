const Joi = require('joi');


module.exports.warehouseSchema = Joi.object({
    warehouse: Joi.object({
        province: Joi.string().required(),
    }).required()
})

module.exports.packageSchema = Joi.object({
    package: Joi.object({
        name: Joi.string().required(),
        weight: Joi.number().required().min(0),
        fee: Joi.number().required().min(0),
        state: Joi.string().required(),
        note: Joi.string().required()
        // senderWarehouse: Joi.string().required(),
        // receiverWarehouse: Joi.string().required()
    }).required()
})

module.exports.storeSchema = Joi.object({
    store: Joi.object({
        district: Joi.string().required(),
    }).required()
})
