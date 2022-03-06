const mongoose = require('mongoose');

const Schema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
})

const PersonalExpenses = mongoose.model('PersonalExpenses', Schema);


module.exports = PersonalExpenses;