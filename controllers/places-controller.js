const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Statue of Unity.',
        description: 'Tallest statue of the world',
        location: {
            lat: 21.8380,
            lng: 73.7191
        },
        address: 'Sardar Sarovar Dam, Statue of Unity Rd, Kevadia, Gujarat 393155',
        creator: 'u1'

    }
];

const getPlaceById =  async (req, res, next)=>{
    const placeId = req.params.pid;
    
    let place;
    try{
        place = await Place.findById(placeId);
    } catch (err){
        const error = new HttpError('Could not find place with id', 500);
        return next(error);
    }

    if(!place){

        const error = new HttpError("Could not find place by provided id.", 404);
        return next(error);
    }

    res.json({place: place.toObject({getters: true})});
};

const getPlacesByUserId = async (req, res, next)=>{
    const userId = req.params.uid;

    let places;
    try{
        places = await Place.find({creator: userId});
    } catch (err){
        const error = new HttpError('Could not find place with user id', 500);
        return next(error);
    }

    if(!places || places.length === 0){
        const error = new HttpError("Could not find places by provided user id.", 404);
        return next(error)
    }
    res.json({ places: places.map(p=>p.toObject({getters: true}))});
};

const createPlace = async (req, res, next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        return next(new HttpError('Invalid input, please check data.', 422));
    }
    const {title, description, address, creator}= req.body;
    
    let coordinates;
    try{
        coordinates = await getCoordsForAddress(address);
    } catch (error){
        return next(error);
    }
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg',
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (error) {
        const err = new HttpError('Creating place has failed, plese try again', 500)
        return next(error); 
    }

    if(!user){
        const err = new HttpError('Could not find user for provided id.', 404);
        return next(error); 
    }
    console.log(user);
//    "places": "64c359155e3900867adfaaf3"
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();

    }catch(error){
        console.log(error);
        const err = new HttpError('Creating place has failed, plese try again', 500)
        return next(err);
    }
    
    res.status(201).json({place: createdPlace});

};

const updatePlace = async (req, res, next) => {
    const { title, description } = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        return next(new HttpError('Invalid input, please check data.', 422));
    }
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId);
    } catch (err){
        const error = new HttpError('Something went wrong, could not get place', 500);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (errr){
        const error = new HttpError('Something went wrong, could not update place.', 500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({getters: true})});
    
};

const deletePlace = async (req, res, next)=>{
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId);
    } catch (err){
        const error = new HttpError('Something went wrong, could not get place', 500);
        return next(error);
    }

    try {
        await place.deleteOne();
    } catch (errr){
        const error = new HttpError('Something went wrong, could not delete place.', 500);
        return next(error);
    }

    res.status(200).json({message : `${placeId} is deleted.`})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;