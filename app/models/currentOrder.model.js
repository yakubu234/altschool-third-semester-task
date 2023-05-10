const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const currentOrder = new Schema({
    guest_id: {
        type: String,
        trim: true,
        required: true,
        unique: [true, 'guest id must be unique']
    },
    current_order: {
        type: String,
        trim: true,
        required: true,
    },


}, { timestamps: true });


module.exports = mongoose.model('current_order', currentOrder);