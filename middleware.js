
const { ObjectID } = require('mongodb');
const SharedExpenses = require('./models/sharedExpenses');
const User = require('./models/users');
const joi = require('joi');
const AppError = require('./utils/AppError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in...')
        return res.redirect('/api/users/login');
    }
    next();
}

//authorization
module.exports.isAuthor = async (req, res, next) => {
    const user = await User.findById(req.params.user_id);
    if (user.username != req.user.username) {
        req.flash("error", "You don't have a permission to do so..");
        return res.redirect(`/api/bills/getSharedExp/${req.user._id}`);
    }
    next();
}


//joi validation of form data (server site)
module.exports.userValidate = (req, res, next) => {
    const userSchema = joi.object({
        email: joi.string().required(),
        phoneNo: joi.number().required().min(1000000000).max(9999999999),
        dateOfBirth: joi.string().required(),
        gender: joi.string().required()
    })
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400);
    }
    else
        next();
}


module.exports.isAuthorBill = async (req, res, next) => {
    const bill = await SharedExpenses.findById(req.params.bill_id);
    console.log(bill.author_id, req.user._id)
    if ((bill.author_id).toString() != (req.user._id).toString()) {
        req.flash("error", "You don't have a permission to do so..");
        return res.redirect(`/api/bills/getSharedExp/${req.user._id}`);
    }
    next();

}

module.exports.friendValidate = (req, res, next) => {
    const friendSchema = joi.object({
        friend_name: joi.string().required(),
        Amount: joi.number().min(0)
    })
    const { error } = friendSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400);
    }
    else
        next();
}

module.exports.PersonalExpValidate = (req, res, next) => {
    const expSchema = joi.object({
        bill_name: joi.string().required(),
        totalAmt: joi.number().min(0).required(),
        category: joi.string().required()
    })
    const { error } = expSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400);
    }
    else
        next();
}
