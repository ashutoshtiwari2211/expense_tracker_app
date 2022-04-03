const router = require('express').Router();
const usersDao = require('../controller/UsersDao');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

const { isLoggedIn, userValidate, isAuthor } = require('../middleware');




router.get('/getInfo/:user_id', isLoggedIn, isAuthor, catchAsync(async function (req, res) {
    const result = await usersDao.funGetUserInfo(req.params.user_id);
    if (!result)
        throw new AppError('User Not Found!!!', 401);
    const user = req.user;
    res.status(result.status).render('users/profile', { user });
}));

router.put('/updateInfo/:user_id', isLoggedIn, isAuthor, userValidate, catchAsync(async function (req, res) {
    const result = await usersDao.funUpdateInfo(req.params.user_id, req.body);
    res.status(result.status).send(result.msg);
}));

router.get('/register', async function (req, res) {
    res.render('users/register');
});

router.post('/register', catchAsync(async function (req, res, next) {
    try {
        const registeredUser = await usersDao.funCreateUser(req.body);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', "REGISTERED!!!")
            res.redirect('/api/dashboard');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/api/users/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/api/users/login' }), (req, res) => {
    req.flash('success', "Welcome Back!!!");
    res.redirect('/api/dashboard');
})
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');

})


const { Users } = require('../models/collections');


module.exports = router;