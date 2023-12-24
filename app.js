const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const Employee = require('./models/employee');

const warehousesRoutes = require('./routes/warehouses');
const packagesRoutes = require('./routes/packages');
const storesRoutes = require('./routes/stores');
const employeesRoutes = require('./routes/employees');

mongoose.connect('mongodb://127.0.0.1:27017/magic-post')
    .then(() => {
        console.log('CONNECTED TO MAGICPOST DATABASE');
    })
    .catch(err => {
        console.log(err);
    })

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//session & flash
const sessionConfig = {
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Employee.authenticate()));
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//routers
app.use('/warehouses', warehousesRoutes);
app.use('/stores', storesRoutes);
app.use('/packages', packagesRoutes);
app.use('/warehouses/:id/packages', packagesRoutes);
app.use('/warehouses/:id/stores', storesRoutes);
app.use('/', employeesRoutes);


app.get('/', (req, res) => {
    res.render('home')
});

//error
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
})