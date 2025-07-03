import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import flightRouter from './routes/flights.js';
import bookedRouter from './routes/bookedflights.js';
import packagecodeRouter from './routes/packagecode.js';
import airplane from './routes/airplane.js';
import charters from './routes/charters.js';
import chatbot from './routes/chatbot.js';
import cityRouter from './routes/cities.js';
import seatRouter from './routes/seats.js';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import http from "http";
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

const allowedOrigins = ['http://localhost:5000', 'http://localhost:5500'];

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS (Socket.io)"));
            }
        },
        credentials: true
    }
});

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
    } catch (e) {
        console.error(e);
    }
};

app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use('/flights', flightRouter);
app.use('/pack', packagecodeRouter);
app.use('/bookedflights', bookedRouter);
app.use('/seats', seatRouter);
app.use('/cities', cityRouter);
app.use('/chatbot', chatbot);
app.use('/charters', charters);
app.use('/airplanes', airplane)

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.set("io", io);

server.listen(port, () => {

    connect();
    console.log(`Server is running on port ${port}.`);
});

