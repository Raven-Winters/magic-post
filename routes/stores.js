const express = require('express');
const router = express.Router({ mergeParams: true });
const ObjectID = require('mongoose').Types.ObjectId;

const Warehouse = require('../models/warehouse');
const Store = require('../models/store');

const { storeSchema } = require('../models/schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

//validate store
const validateStore = (req, res, next) => {
    const { error } = storeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//all stores
router.get('/', catchAsync(async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/index', { stores });
}))

//add store
router.post('/', isLoggedIn, validateStore, catchAsync(async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id);
    try {
        const store = new Store(req.body.store);
        warehouse.stores.push(store);
        await store.save();
        await warehouse.save();
        req.flash('success', 'Created new store!');
        res.redirect(`/warehouses/${warehouse._id}`);
    } catch (e) {
        req.flash('error', 'Store already exists');
        res.redirect(`/warehouses/${warehouse._id}`);
    }
}))

//show store
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find store');
        return res.redirect('/stores');
    }
    const store = await Store.findById(id);
    res.render('stores/show', { store });
}))

//delete store
router.delete('/:storeID', isLoggedIn, catchAsync(async (req, res) => {
    const { id, storeID } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find store');
        return res.redirect(`/warehouses/${id}`);
    }
    await Warehouse.findByIdAndUpdate(id, { $pull: { stores: storeID } });
    await Store.findByIdAndDelete(storeID);
    req.flash('success', 'Successfully deleted store')
    res.redirect(`/warehouses/${id}`);
}))

module.exports = router;