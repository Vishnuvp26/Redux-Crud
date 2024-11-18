const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const mongoDB_URI = process.env.MONGO_URI;
mongoose.connect(mongoDB_URI)
.then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log('Server running');
});