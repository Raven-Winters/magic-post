const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;

const catchAsync = require('../utils/catchAsync');

const Warehouse = require('../models/warehouse');
const { isLoggedIn, isManager, validateWarehouse } = require('../middleware');


//all warehouses
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const warehouses = await Warehouse.find({});
    res.render('warehouses/index', { warehouses });
}))


//create warehouse
router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    res.render('warehouses/new');
}))

router.post('/', isLoggedIn, validateWarehouse, catchAsync(async (req, res, next) => {
    try {
        const warehouse = new Warehouse(req.body.warehouse);
        warehouse.manager = req.user._id;
        await warehouse.save();
        req.flash('success', 'Created new warehouse successfully');
        res.redirect(`/warehouses/${warehouse._id}`);
    } catch (e) {
        req.flash('error', 'Warehouse already exists');
        res.redirect(`/warehouses/new`);
    }
}))

//show warehouse
router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find warehouse');
        return res.redirect('/warehouses');
    }
    const warehouse = await Warehouse.findById(id).populate('packages').populate('stores').populate('manager');
    res.render('warehouses/show', { warehouse });
}))

//edit warehouse
router.get('/:id/edit', isLoggedIn, isManager, catchAsync(async (req, res) => {
    const { id } = req.params;
    const warehouse = await Warehouse.findById(id);
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find warehouse');
        return res.redirect('/warehouses');
    }
    res.render('warehouses/edit', { warehouse });
}))

router.put('/:id', isLoggedIn, isManager, validateWarehouse, catchAsync(async (req, res) => {
    const { id } = req.params;
    try {
        const warehouse = await Warehouse.findByIdAndUpdate(id, { ...req.body.warehouse }, { new: true });
        req.flash('success', 'Updated warehouse successfully');
        res.redirect(`/warehouses/${warehouse._id}`);
    } catch (e) {
        const warehouse = await Warehouse.findById(id);
        req.flash('error', 'Warehouse already exists');
        res.redirect(`/warehouses/${warehouse._id}/edit`);
    }
}))

//delete warehouse
router.delete('/:id', isLoggedIn, isManager, catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find warehouse');
        return res.redirect('/warehouses');
    }
    await Warehouse.findByIdAndDelete(id);
    req.flash('success', 'Delete warehouse successfully');
    res.redirect('/warehouses');
}))

module.exports = router;