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
    members: [{
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        owe: {
            type: Number,
            default: 0,
            min: [0, "minimum amount should be 0"]
        }
    }
    ]

})

const SharedExpenses = mongoose.model('SharedExpenses', Schema);
module.exports = SharedExpenses;