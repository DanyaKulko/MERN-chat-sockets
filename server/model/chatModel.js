const {Schema, model} = require('mongoose');

const chatSchema = new Schema({
    users: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    lastMessage: {type: Schema.Types.ObjectId, ref: 'Message'},
    isPrivate: {type: Boolean, default: false}

}, {timestamps: true});

module.exports = model('Chat', chatSchema);