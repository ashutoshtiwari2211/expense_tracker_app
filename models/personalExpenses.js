const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    bill_name: {
        type: String,
        required: true
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    date: {
        type: String,
        require: true
    },
    totalAmt: {
        type: Number,
        required: [true, "Total Expenditure is required"]
    },
    category: {
        type: String,
        enum: ['travel', 'food', 'clothing', 'health', 'entertainment', 'others'],
        required: true
    }
})

const PersonalExpenses = mongoose.model('PersonalExpenses', Schema);


module.exports = PersonalExpenses;