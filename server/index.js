const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const createSocketServer = require('./sockets');
const path = require("path");
require('dotenv').config();


const app = express();
const clientAddress = 'http://localhost:3000';

app.use(cors({
    origin: clientAddress,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,POST,PUT,DELETE'
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/user_profile_images', express.static('uploads'));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);


try {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {

        console.log('mongodb started!');

        const server = app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
        createSocketServer(server, clientAddress);

    }).catch((err) => {
        console.log(err);
    })

} catch (error) {
    console.log(error);
}

