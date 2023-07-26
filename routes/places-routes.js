const express = require('express');

const router = express.Router();

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
    res.json({place});
});

router.get('/user/:uid', (req, res, next)=>{
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find((u)=>{
        return u.creator === userId;
    });
    res.json({place});
})

module.exports = router;