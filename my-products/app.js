const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const router = require('./routes');

// Establish db connection
const { DB_URI } = require("./config");
const mongoose = require("mongoose");

mongoose.connect(DB_URI).then(data => {
    console.log("connected to DB")
}).catch(error => {
    console.log("DB Error: ", error);
});

app.use(bodyParser.json());

app.use('/api', router);

// Init the app server
app.listen(3000, (err) => {
    if(err){
        console.log('--- Server Error ---');
    }
    else {
        console.log('App app started successfully on port 3000');
    }
});