const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Employee = require('../models/employee');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

const employeesController = require('../controllers/employees');

//registering
router.route('/register')
    .get(employeesController.renderRegisterForm)
    .post(catchAsync(employeesController.registerAdmin));

//logging in
router.route('/login')
    .get(employeesController.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), employeesController.login);

//logging out
router.get('/logout', employeesController.logout);

module.exports = router;