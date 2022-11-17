const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const bookOpsRoutes = require('./routes/bookOps');

//Connecting Mongo
mongoose.connect(process.env.DB_CONNECT, ()=>{
    console.log("Connected to database");
});

//Body parser
app.use(express.json());

//Book ops routes
app.use('/api/books', bookOpsRoutes);

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started");
})