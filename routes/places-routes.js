const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const placeController = require('../controllers/places-controller');

router.get('/:pid', placeController.getPlaceById);
router.get('/user/:uid', placeController.getPlacesByUserId);
router.post('/', [
                check('title')
                    .not()
                    .isEmpty().isLength({min: 3}),
                check('description')
                    .not()
                    .isEmpty().isLength({min: 3}),
                // check('location')
                //     .not()
                //     .isEmpty(),
                check('address')
                    .not()
                    .isEmpty().isLength({min: 3}),
                check('creator')
                    .not()
                    .isEmpty(),
                ], placeController.createPlace);
router.patch('/:pid',[
    check('title')
        .not()
        .isEmpty().isLength({min: 2}),
    check('description')
        .not()
        .isEmpty().isLength({min: 5}),
    ], 
    placeController.updatePlace);
router.delete('/:pid', placeController.deletePlace);

module.exports = router;