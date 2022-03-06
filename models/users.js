const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    // username : unique
    // password : hash
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    avtar: {
        type: String
    }
})

userSchema.plugin(passportLocalMongoose);

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
