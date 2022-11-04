const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const User = require("../model/userModel");
const userDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/ApiError");

class ChatService {

    async getAllChats(userId) {

        const chats = await Chat
            .find({users: {$in: userId}})
            .populate({path: 'users', match: {_id: {$ne: userId}}, select: 'username email isOnline lastOnline avatar isAvatarSet'})
            .populate({path: 'lastMessage', populate: {path: 'user', select: 'username email'}})

        return {
            chats
        }
    }


    async getChatInfo(chatId, userId) {
        console.log(userId, chatId);
        if (!chatId) {
            throw new ApiError("Chat id is required");
        }

        const chat = await Chat.findById(chatId)

        // if chat was found, just return data
        if (chat) {
            await chat.populate({
                path: 'users',
                match: {_id: {$ne: userId}},
                select: 'username email isOnline lastOnline avatar isAvatarSet'
            })

            const messages = await Message.find({chat: chatId}).populate({
                path: 'user',
                select: 'username email isOnline lastOnline avatar isAvatarSet'
            }).lean()

            return {
                chat: chat,
                messages: messages
            }
        }

        // if chat was not found by id, let's find it by users ids
        const chatFromUser = await Chat.findOne({
            users: {$all: [chatId, userId]},
            isPrivate: true
        });

        if (chatFromUser) {
            await chatFromUser.populate({
                path: 'users',
                match: {_id: {$ne: userId}},
                select: 'username email isOnline lastOnline avatar isAvatarSet'
            })

            const messages = await Message.find({chat: chatFromUser._id}).populate({
                path: 'user',
                select: 'username email isOnline lastOnline avatar isAvatarSet'
            }).lean()

            return {
                chat: {
                    users: [{...new userDto(chatFromUser.users[0])}],
                    isPrivate: true,
                    _id: chatFromUser._id,
                },
                messages: messages
            }
        }

        // if chat was not found, return just empty chat
        const user = await User.findById(chatId).select('username email isOnline lastOnline avatar isAvatarSet').lean();
        return {
            chat: {
                users: [{...new userDto(user)}],
                isPrivate: true,
                _id: user._id
            },
            messages: []
        }

    }

    async sendMessage(chatId, userId, message) {
        if (!message || !chatId) {
            throw new ApiError("Message and chat id are required");
        }

        const chat = await Chat.findById(chatId);

        //if chat was found, just add message to it and update it
        if (chat) {
            const newMessage = await new Message({
                message,
                chat: chat._id,
                user: userId
            }).save();

            await newMessage.populate({
                path: 'user',
                select: 'username email isOnline lastOnline avatar isAvatarSet'
            })

            chat.lastMessage = newMessage._id;
            await chat.save()

            await chat.populate({
                path: 'lastMessage',
                populate: {path: 'user', select: 'username email'}
            })
            await chat.populate({
                path: 'users',
                select: 'username email isOnline lastOnline avatar isAvatarSet'
            })
            const usersToSend = chat.users.map(user => user._id.toString());

            return {newMessage, chat, usersToSend}
        }

        // if chat was not found by id, let's find it by users ids
        const chatFromUser = await Chat.findOne({
            users: {$all: [chatId, userId]},
            isPrivate: true
        }).populate({
            path: 'users',
            select: 'username email isOnline lastOnline avatar isAvatarSet'
        });

        if (chatFromUser) {
            const newMessage = await new Message({
                message,
                chat: chatFromUser._id,
                user: userId
            }).save();

            await newMessage.populate({
                path: 'user',
                select: 'username email isOnline lastOnline avatar isAvatarSet'
            })

            chatFromUser.lastMessage = newMessage._id;
            await chatFromUser.save()

            await chatFromUser.populate({
                path: 'lastMessage',
                populate: {path: 'user', select: 'username email'}
            })
            await chatFromUser.populate({
                path: 'users',
                select: '_id username email isOnline lastOnline avatar isAvatarSet'
            })
            const usersToSend = chatFromUser.users.map(user => user._id.toString());
            await chatFromUser.populate({
                path: 'users',
                match: {_id: {$ne: userId}},
                select: 'username email isOnline lastOnline avatar isAvatarSet'
            })

            return {newMessage, chat: chatFromUser, usersToSend}

        }

        // if chat was not found, let's create the new one
        const user = await User.findById(chatId).lean();

        if (!user) {
            throw new ApiError("Chat not found");
        }

        const newChat = await new Chat({
            users: [userId, user._id],
            lastMessage: message,
            isPrivate: true
        })

        const newMessage = await new Message({
            message,
            chat: newChat._id,
            user: userId
        }).save();

        await newMessage.populate({
            path: 'user',
            select: 'username email isOnline lastOnline avatar isAvatarSet'
        })

        newChat.lastMessage = newMessage._id;

        await newChat.save();

        await newChat.populate({
            path: 'lastMessage',
            populate: {path: 'user', select: 'username email'}
        })

        const usersToSend = newChat.users.map(user => user._id.toString());

        await newChat.populate({
            path: 'users',
            match: {_id: {$ne: userId}},
            select: 'username email isOnline lastOnline avatar isAvatarSet'
        })

        return {newMessage, chat: newChat, usersToSend}
    }

    async getOnlineUsersFromChatByUserId(userId) {
        // get all chats where user is in users array
        const chats = await Chat.find({users: {$in: userId}, isPrivate: true})
            .populate({
                path: 'users',
                match: {_id: {$ne: userId}, isOnline: true},
                select: 'username isOnline'
            })
            .lean();

        return chats
            .filter(elem => elem.users.length > 0)
            .map(elem =>  elem.users[0]._id.toString())
    }

    async getOnlineUsersFromChatByChatId(chatId, userId) {
        // get all chats where user is in users array
        const chats = await Chat.find({_id: chatId})
            .populate({
                path: 'users',
                match: {_id: {$ne: userId}, isOnline: true},
                select: 'username isOnline'
            })
            .lean();

        return chats
            .filter(elem => elem.users.length > 0)
            .map(elem => elem.users[0]._id.toString())
    }

    async deleteMessage(chatId, userId, messageId) {
        const message = await Message.findById(messageId);

        if (!message) {
            throw new ApiError("Message not found");
        }
        if (message.user.toString() !== userId) {
            throw new ApiError("You can't delete this message");
        }

        await message.remove();
        const chat = await Chat.findById(chatId);

        if (!chat) {
            throw new ApiError("Chat not found");
        }

        chat.lastMessage = await Message.findOne({chat: chatId}).sort({createdAt: -1});
        await chat.save();

        const usersToSend = await this.getOnlineUsersFromChatByChatId(chatId, userId);

        return {usersToSend};
    }

    async editMessage(chatId, userId, messageId, message) {
        const messageToEdit = await Message.findById(messageId);
        console.log(messageToEdit)
        if (!messageToEdit) {
            throw new ApiError("Message not found");
        }

        if (messageToEdit.user.toString() !== userId) {
            throw new ApiError("You can't edit this message");
        }

        messageToEdit.message = message;
        await messageToEdit.save();

        const chat = await Chat.findById(chatId);

        if (!chat) {
            throw new ApiError("Chat not found");
        }

        chat.lastMessage = await Message.findOne({chat: chatId}).sort({createdAt: -1});
        await chat.save();

        const usersToSend = await this.getOnlineUsersFromChatByChatId(chatId, userId);

        return {newMessage: messageToEdit, chat, usersToSend};

    }

}

module.exports = new ChatService();