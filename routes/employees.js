const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Employee = require('../models/employee');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');


router.get('/register', (req, res) => {
    res.render('employees/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
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
}))

router.get('/login', (req, res) => {
    res.render('employees/login');
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome!');
    const redirectUrl = res.locals.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
});

module.exports = router;