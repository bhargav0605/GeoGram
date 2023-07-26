const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

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

const getPlaceById =  (req, res, next)=>{
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p) => {
        return p.id === placeId;
    });

    if(!place){

        const error = new HttpError("Could not find place by provided id.", 404);
        throw error;
    }
    res.json({place});
};

const getPlacesByUserId = (req, res, next)=>{
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter((u)=>{
        return u.creator === userId;
    });
    if(!places || places.length === 0){
        const error = new HttpError("Could not find places by provided user id.", 404);
        return next(error)
    }
    res.json({places});
};

const createPlace = async (req, res, next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        next(new HttpError('Invalid input, please check data.', 422));
    }
    const {title, description, address, creator}= req.body;
    
    let coordinates;
    try{
        coordinates = await getCoordsForAddress(address);
    } catch (error){
        return next(error);
    }
    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({place: createdPlace});

};

const updatePlace = (req, res, next) => {
    const { title, description } = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        throw new HttpError('Invalid input, please check data.', 422);
    }
    const placeId = req.params.pid;

    const updatePlace = { ...DUMMY_PLACES.find(p=>p.id === placeId) };
    const placIndex = DUMMY_PLACES.findIndex(p=>p.id===placeId);
    updatePlace.title = title;
    updatePlace.description = description;

    DUMMY_PLACES[placIndex] = updatePlace;

    res.status(200).json({place: updatePlace});
    
};

const deletePlace = (req, res, next)=>{
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p=>p.id === placeId);
    if(!place){
        throw new HttpError("No place found", 422);
    }
    DUMMY_PLACES.pop(place);

    res.status(200).json({message : `${placeId} is deleted.`})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;