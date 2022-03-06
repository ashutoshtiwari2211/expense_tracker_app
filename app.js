const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { dirname } = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');

//built-in middleware
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'))
app.use(morgan('tiny'));

const sessionConfig = {
    secret: 'Thisisasecretcode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
const Users = require('./models/users');
passport.use(new LocalStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser()); // these used as sessions from passprt

//An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.

app.use((req, res, next) => {
    res.locals.user = req.user; //actually passport attached methods to req such as req.isAuthenticate(), req.user etc 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next(); //whatever there in req-flash it attached to res object and can use it
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
// Set directory to contain the templates ('views')
app.set('views', path.join(__dirname, 'views'));

//use static files in app.js
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'partials')));


mongoose.connect('mongodb://localhost:27017/ExpenseTracker' || "online link", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongoose's Connection made!!!");
    })
    .catch(err => {
        console.log("ERROR While Connecting");
        console.log(err);
    })

const billsRoutes = require('./routes/Bills');
const usersRoutes = require('./routes/Users');
//const notificationsRoutes = require('./routes/Notifications');
const friendsRoutes = require('./routes/Friends');

const { isLoggedIn } = require('./middleware');
const AppError = require('./utils/AppError');
app.use('/api/bills', isLoggedIn, billsRoutes)
app.use('/api/users', usersRoutes);
app.use('/api/friends', isLoggedIn, friendsRoutes);
app.use('/api/dashboard', isLoggedIn, (req, res) => {
    usr = req.user;
    res.render('dashboard', usr);
})
app.use('/home', (req, res) => {
    res.render('home.ejs');
})
app.use('*', (req, res, next) => {
    next(new AppError('Page Not Found "404"', 404));
})



//The four arguments denote that this is an error handling middleware
app.use((err, req, res, next) => {
    if (err.name === 'CastError' || err.name === 'ValidationError')
        next(new AppError(`Failed... : ${err.message}`, 400));
    else
        next(err);

});
app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong!!!" } = err;
    res.status(status).render('error', { err });  //task: make error template
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
})