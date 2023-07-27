const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const placeRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use('/api/places',placeRoutes);
app.use('/api/users', userRoutes);
app.use((req, res, next)=>{
    const error = new HttpError('Count not find this route.', 404);
    throw error;
});

app.use((error, req, res, next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message  || 'An unknown error occured.'});
});

mongoose
    .connect(process.env.DB_URL)
    .then(()=>{
        app.listen(5000);
    })
    .catch((err)=>{
        console.log(err);
    });
