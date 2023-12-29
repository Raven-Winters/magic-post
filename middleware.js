const ExpressError = require('./utils/ExpressError');

const { warehouseSchema, packageSchema, storeSchema } = require('./models/schemas');
const Warehouse = require('./models/warehouse');
const Package = require('./models/package');
const Store = require('./models/store');


// check if logged in as admin
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You are not an admin!');
        return res.redirect('/login');
    }
    next();
}

//save path
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//authorize
module.exports.isWarehouseManager = async (req, res, next) => {
    const { id } = req.params;
    const warehouse = await Warehouse.findById(id);
    if (!warehouse.manager.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/warehouses/${id}`);
    }
    next();
}

//check if user is manager
module.exports.isPackageManager = async (req, res, next) => {
    const { id } = req.params;
    const package = await Package.findById(id);
    if (!package.manager.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/packages/${id}`);
    }
    next();
}

module.exports.isStoreManager = async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!store.manager.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/stores/${id}`);
    }
    next();
}

//validate warehouse
module.exports.validateWarehouse = (req, res, next) => {
    const { error } = warehouseSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//validate package
module.exports.validatePackage = (req, res, next) => {
    const { error } = packageSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//validate store
module.exports.validateStore = (req, res, next) => {
    const { error } = storeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}