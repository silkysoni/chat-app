import express from 'express'
import chatRoutes from './routes/chatRoute.js'
import dotenv from 'dotenv'
import cors from 'cors'
import connection from './connection/db.js'
import UserRoute from './routes/UserRoute.js'
import GroupRoutes from './routes/GroupRoute.js'
import MessageRoutes from './routes/MessageRoutes.js'
import { Server } from 'socket.io';

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
connection()

app.use('/chat', chatRoutes)
app.use('/user', UserRoute)
app.use('/group', GroupRoutes)
app.use('/message', MessageRoutes)
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    },
});

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });


    socket.off("setup", () => {
        socket.leave(userData._id);
    });
});


export default io