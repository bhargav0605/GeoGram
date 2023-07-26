const express = require('express');

const router = express.Router();

const placeController = require('../controllers/places-controller');

router.get('/:pid', placeController.getPlaceById);

router.get('/user/:uid', placeController.getPlaceByUserId);

// POST
router.post('/', placeController.createPlace);

module.exports = router;