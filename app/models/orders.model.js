const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
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


module.exports = mongoose.model('orders', order);