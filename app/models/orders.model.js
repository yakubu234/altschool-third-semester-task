const mongoose = require('mongoose');

//Define a schema
const Schema = mogoose.Schema;
const order = new Schema({
    guest_id: {
        type: String,
        trim: true,
        required: true,
    },
    current_order: {
        type: String,
        trim: true,
        required: true,
    },


}, { timestamps: true });


module.exports = mogoose.model('orders', order);