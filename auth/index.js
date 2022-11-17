const express = require('express');
const app = express();

const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//Connecting Mongo
mongoose.connect(process.env.DB_CONNECT, ()=>{
    console.log("Connected to database");
});

//Body parser
app.use(express.json());

//Authentication route
app.use('/api/user', authRoute);

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started");
})