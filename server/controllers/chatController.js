const ChatService = require('../services/chat-service');

const getAllChats = async (req, res, next) => {
    try {
        const response = await ChatService.getAllChats(req.user.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        });
    }
}

const getChat = async (req, res, next) => {
    console.log(req.query.id);
    try {
        const response = await ChatService.getChatInfo(req.query.id, req.user.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        });
    }
}


module.exports = {getAllChats, getChat}