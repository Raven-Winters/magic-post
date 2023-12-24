const express = require('express');
const router = express.Router({ mergeParams: true });
const ObjectID = require('mongoose').Types.ObjectId;

const Warehouse = require('../models/warehouse');
const Package = require('../models/package');

const { isLoggedIn, isManager, validatePackage } = require('../middleware');


const catchAsync = require('../utils/catchAsync');


//all packages
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const packages = await Package.find({});
    res.render('packages/index', { packages });
}))

//add package
router.post('/', isLoggedIn, isManager, validatePackage, catchAsync(async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id);
    try {
        const package = new Package(req.body.package);
        package.manager = req.user._id;
        warehouse.packages.push(package);
        await package.save();
        await warehouse.save();
        req.flash('success', 'Created new package!');
        res.redirect(`/warehouses/${warehouse._id}`);
    } catch (e) {
        req.flash('error', 'Input Error');
        res.redirect(`/warehouses/${warehouse._id}`)
    }
}))

//show package
router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find package');
        return res.redirect('/packages');
    }
    const package = await Package.findById(id);
    res.render('packages/show', { package });
}))

//edit package
router.get('/:id/edit', isLoggedIn, isManager, catchAsync(async (req, res) => {
    const { id } = req.params;
    const package = await Package.findById(id);
    if (!ObjectID.isValid(id)) {
        req.flash('error', 'Cannot find package');
        return res.redirect('/packages');
    }
    res.render('packages/edit', { package });
}))

router.put('/:id', isLoggedIn, isManager, validatePackage, catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const package = await Package.findByIdAndUpdate(id, { ...req.body.package }, { new: true });
        req.flash('success', 'Updated package successfully');
        res.redirect(`/packages/${package._id}`);
    } catch (e) {
        const { id } = req.params;
        const package = await Package.findById(id);
        req.flash('error', 'Input Error');
        res.redirect(`/packages/${package._id}`);
    }
}))

//delete package
router.delete('/:packageID', isLoggedIn, isManager, catchAsync(async (req, res) => {
    const { id, packageID } = req.params;
    if (!ObjectID.isValid(packageID)) {
        req.flash('error', 'Cannot find package');
        return res.redirect(`/warehouses/${id}`);
    }
    await Warehouse.findByIdAndUpdate(id, { $pull: { packages: packageID } });
    await Package.findByIdAndDelete(packageID);
    req.flash('success', 'Successfully deleted package');
    res.redirect(`/warehouses/${id}`);
}))

module.exports = router;