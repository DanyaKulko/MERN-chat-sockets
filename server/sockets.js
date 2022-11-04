const TokenService = require("./services/token-service");
const UserService = require("./services/user-service");
const ChatService = require("./services/chat-service");
const socket = require("socket.io");

let connectedUsers = [];

const createSocketServer = (server, clientAddress) => {
    console.log("Creating socket server");
    const io = socket(server, {
        cors: {
            origin: clientAddress
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });



    io.use((socket, next) => {
        if (socket.handshake?.query?.token) {
            const tokenData = TokenService.validateAccessToken(socket.handshake.query.token);
            if (tokenData) {
                socket.tokenData = tokenData;
                return next();
            } else {
                return next(new Error('Authentication error'));
            }

        } else {
            next(new Error('Authentication error'));
        }
    }).on('connection', async (socket) => {

        // set user online and add to connected users array
        console.log(`Socket with id ${socket.id} connected`);
        connectedUsers.push({user_id: socket.tokenData.id, socket_id: socket.id});
        await UserService.setOnline(socket.tokenData.id).catch(err => console.log(err));


        const notify = (usersList, emitMessage, message) => {
            usersList.forEach(userId => {
                const userIndex = connectedUsers.findIndex(connected => connected.user_id === userId);
                if (userIndex !== -1) {

                    const userSocketId = connectedUsers[userIndex].socket_id;
                    io.to(userSocketId).emit(emitMessage, message);
                }
            });
        }

        // notify users that user is online
        const userToNotify = await ChatService.getOnlineUsersFromChatByUserId(socket.tokenData.id)
        notify(userToNotify, 'went online', socket.tokenData.id);


        socket.on('send message', async ({chatId, message}) => {
            try {
                const {
                    newMessage,
                    chat,
                    usersToSend
                } = await ChatService.sendMessage(chatId, socket.tokenData.id, message);
                // send message to all users in chat
                notify(usersToSend, 'new message', {newMessage, chat});

            } catch (err) {
                console.log(err);
            }
        })

        socket.on('set typing', async ({chatId, isTyping}) => {
            try {
                const userToNotify = await ChatService.getOnlineUsersFromChatByChatId(chatId, socket.tokenData.id);

                // send message to all users in chat
                notify(userToNotify, 'set typing', {isTyping, userId: socket.tokenData.id});

            } catch (err) {
                console.log(err);
            }
        })

        socket.on('edit message', async (data) => {
            const {chatId, messageId, message} = data;
            console.log(data);
            try {

                const {
                    newMessage,
                    chat,
                    usersToSend
                } = await ChatService.editMessage(chatId, socket.tokenData.id, messageId, message);

                // send message to all users in chat
                notify(usersToSend, 'edit message', {message: newMessage, chat});

            } catch (err) {
                console.log(err);
            }
        })

        socket.on('delete message', async ({chat_id, message_id}) => {
            try {
                const {
                    usersToSend
                } = await ChatService.deleteMessage(chat_id, socket.tokenData.id, message_id);
                console.log(usersToSend)
                // send message to all users in chat
                notify(usersToSend, 'delete message', {message_id, chat_id});

            } catch (err) {
                console.log(err);
            }
        })


        socket.on('disconnect', async () => {
            // set user offline
            const userToNotify = await ChatService.getOnlineUsersFromChatByUserId(socket.tokenData.id)
            notify(userToNotify, 'went offline', socket.tokenData.id);

            connectedUsers = connectedUsers.filter(user => user.socket_id !== socket.id);
            UserService.setOffline(socket.tokenData.id).catch(err => console.log(err));
            console.log(`user ${socket.id} disconnected`);
        });
    });
}

module.exports = createSocketServer;