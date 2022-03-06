const router = require('express').Router();
const catchAsync = require('../utils/catchAsync');
const friendsDao = require('../controller/friendsDao');
const { isAuthor, friendValidate } = require('../middleware');


router.get('/getAllFriends/:user_id', catchAsync(async function (req, res) {
    const docs = await friendsDao.funGetAllFriends(req.params.user_id);
    res.render('friends/allFriends', { docs });
}));

router.post('/addFriend/:user_id', isAuthor, friendValidate, catchAsync(async function (req, res) {
    const doc = await friendsDao.funAddFriend(req.body, req.user);
    if (!doc)
        req.flash('error', "Already added as Your Friend!!!");
    res.redirect(`/api/friends/getAllFriends/${req.user._id}`)
}));

router.post('/pay/:user_id', isAuthor, catchAsync(async function (req, res) {
    const doc = await friendsDao.funPayToFriend(req.body, req.user);
    res.redirect(`/api/friends/exchange/${req.user._id}`);

}));

router.get('/exchange/:user_id', isAuthor, catchAsync(async function (req, res) {
    const docs = await friendsDao.funGetExchangeDetails(req.params.user_id);
    res.render('friends/index', { docs });
}))

router.put('/exchangeUpdate/:user_id/:friend_id', isAuthor, catchAsync(async function (req, res) {
    const docs = await friendsDao.funExchangeUpdate(req.params.friend_id, req.user._id);
    res.redirect(`/api/friends/exchange/${req.user._id}`);
    console.log(docs);
}))

module.exports = router;