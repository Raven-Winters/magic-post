const ExpressError = require('./utils/ExpressError');

const { warehouseSchema } = require('./models/schemas');
const { packageSchema } = require('./models/schemas');
const Warehouse = require('./models/warehouse');
const Package = require('./models/package');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You are not an admin!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
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

//authorize
module.exports.isManager = async (req, res, next) => {
    const { id } = req.params;
    const warehouse = await Warehouse.findById(id);
    if (!warehouse.manager.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/warehouses/${id}`);
    }
    next();
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