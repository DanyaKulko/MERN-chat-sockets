const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Message', messageSchema);