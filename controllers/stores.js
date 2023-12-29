const ObjectID = require('mongoose').Types.ObjectId;
const Warehouse = require('../models/warehouse');
const Store = require('../models/store');

module.exports.index = async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/index', { stores });
}

module.exports.createStore = async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id);
    try {
        const store = new Store(req.body.store);
        store.manager = req.user._id;
        warehouse.stores.push(store);
        await store.save();
        await warehouse.save();
        req.flash('success', 'Created new store!');
        res.redirect(`/warehouses/${warehouse._id}`);
    } catch (e) {
        req.flash('error', 'Store already exists');
        res.redirect(`/warehouses/${warehouse._id}`);
    }
}

module.exports.showStore = async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find store');
        return res.redirect('/stores');
    }
    const store = await Store.findById(id).populate('manager');
    res.render('stores/show', { store });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find store');
        return res.redirect('/stores');
    }
    res.render('stores/edit', { store });
}

module.exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findByIdAndUpdate(id, { ...req.body.store }, { new: true });
        req.flash('success', 'Updated store successfully');
        res.redirect(`/stores/${store._id}`);
    } catch (e) {
        const { id } = req.params;
        const store = await Store.findById(id);
        req.flash('error', 'Input Error');
        res.redirect(`/stores/${store._id}`);
    }
}

module.exports.deleteStore = async (req, res) => {
    const { id, storeID } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find store');
        return res.redirect(`/warehouses/${id}`);
    }
    await Warehouse.findByIdAndUpdate(id, { $pull: { stores: storeID } });
    await Store.findByIdAndDelete(storeID);
    req.flash('success', 'Successfully deleted store')
    res.redirect(`/warehouses/${id}`);
}