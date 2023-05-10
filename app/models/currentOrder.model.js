// const mongoose =  require(__basedir + '/app/models/orders.model');

//Define a schema
const Schema = mogoose.Schema;
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


module.exports = mogoose.model('current_order', currentOrder);