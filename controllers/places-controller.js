const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

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

//function getPlaceById()..
// const getPlaceById = function(){..}

const getPlaceByUserId = (req, res, next)=>{
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find((u)=>{
        return u.creator === userId;
    });
    if(!place){
        const error = new HttpError("Could not find user by provided id.", 404);
        return next(error)
    }
    res.json({place});
};

const createPlace = (req, res, next)=>{
    const {title, description, coordinates, address, creator}= req.body;
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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;