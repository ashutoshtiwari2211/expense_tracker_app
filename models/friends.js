const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    friend1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    updated: {
        type: String,
        require: true
    },
    friend2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    frd1ToFrd2: {
        type: Number,
        default: 0
    }

})

const Friends = mongoose.model('Friends', Schema);

module.exports = Friends;