const Warehouse = require('../models/warehouse');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.index = async (req, res) => {
    const warehouses = await Warehouse.find({});
    res.render('warehouses/index', { warehouses });
}

module.exports.renderNewForm = (req, res) => {
    res.render('warehouses/new');
}

module.exports.createWarehouse = async (req, res, next) => {
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
}

module.exports.showWarehouse = async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find warehouse');
        return res.redirect('/warehouses');
    }
    const warehouse = await Warehouse.findById(id).populate('packages').populate('stores').populate('manager');
    res.render('warehouses/show', { warehouse });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const warehouse = await Warehouse.findById(id);
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find warehouse');
        return res.redirect('/warehouses');
    }
    res.render('warehouses/edit', { warehouse });
}

module.exports.updateWarehouse = async (req, res) => {
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
}

module.exports.deleteWarehouse = async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find warehouse');
        return res.redirect('/warehouses');
    }
    await Warehouse.findByIdAndDelete(id);
    req.flash('success', 'Delete warehouse successfully');
    res.redirect('/warehouses');
}