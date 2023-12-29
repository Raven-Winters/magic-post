const Employee = require('../models/employee');


module.exports.renderRegisterForm = (req, res) => {
    res.render('employees/register')
}

module.exports.registerAdmin = async (req, res, next) => {
    try {
        const { email, username, name, phoneNumber, password } = req.body;
        const employee = new Employee({ email, username, name, phoneNumber });
        const registeredEmployee = await Employee.register(employee, password);
        req.login(registeredEmployee, err => {
            if (err) return next(err);
            req.flash('success', 'Registered successfully');
            res.redirect('/warehouses');
        });
    } catch (e) {
        req.flash('error', 'Username or email is already in use');
        res.redirect('register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('employees/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome!');
    const redirectUrl = res.locals.returnTo || '/warehouses';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}