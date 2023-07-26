const express = require('express');

const router = express.Router();

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

router.get('/:pid', (req, res, next)=>{
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p) => {
        return p.id === placeId;
    });

    if(!place){

        const error = new HttpError("Could not find place by provided id.", 404);
        // error.code = 404;
        throw error;
        // return res.status(404).json({message: "Could not find place by provided id."});
    }
    res.json({place});
});

router.get('/user/:uid', (req, res, next)=>{
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find((u)=>{
        return u.creator === userId;
    });
    if(!place){
        const error = new HttpError("Could not find user by provided id.", 404);
        return next(error)
    }
    res.json({place});
})

module.exports = router;