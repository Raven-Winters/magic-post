if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express'); //express
const path = require('path');
const mongoose = require('mongoose'); //database
const ejsMate = require('ejs-mate');
const session = require('express-session'); //session
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); //flash
const ExpressError = require('./utils/ExpressError'); //catch error
const methodOverride = require('method-override'); //method overrride
const passport = require('passport'); // passport
const localStrategy = require('passport-local');
const Employee = require('./models/employee');

//routes
const warehousesRoutes = require('./routes/warehouses');
const packagesRoutes = require('./routes/packages');
const storesRoutes = require('./routes/stores');
const employeesRoutes = require('./routes/employees');
const contactsRoutes = require('./routes/contacts');
// const trackingRoutes = require('./routes/tracking');

//connect to cloud DB
// const dbUrl = "mongodb://127.0.0.1:27017/magic-post"
const dbUrl = "mongodb+srv://21020514:0R3cuevA4M4yQ9IL@cluster0.ufr558k.mongodb.net/magic-post"
mongoose.connect(dbUrl)
    .then(() => {
        console.log('CONNECTED TO MAGICPOST DATABASE');
    })
    .catch(err => {
        console.log(err);
    })

//start express
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//session & flash
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
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

app.use('/warehouses', warehousesRoutes);
app.use('/stores', storesRoutes);
app.use('/packages', packagesRoutes);
app.use('/contacts', contactsRoutes);
// app.use('/tracking', trackingRoutes);
app.use('/warehouses/:id/packages', packagesRoutes);
app.use('/warehouses/:id/stores', storesRoutes);
app.use('/', employeesRoutes);

// const loadAPI = async () => {
//     try {
//         const res = await fetch(`./seeds/warehouses.json`);
//         const data = await res.json();
//         console.log(data);
//     }
//     catch {
//         console.log("ERROR");
//     }
// }

//homepage
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

//listen
app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
})