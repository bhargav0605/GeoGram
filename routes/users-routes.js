const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/users-controller');

router.get('/', userController.getUsers);
router.post('/login',
    [
        check('email')
            .not()
            .isEmail()
            .isEmpty(),
        check('password')
            .not()
            .isEmpty()
    ], 
    userController.login);
router.post('/signup',
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .not()
            .isEmail().normalizeEmail()
            .isEmpty(),
        check('password')
            .not()
            .isEmpty().isLength({min: 3})
    ] ,
    userController.signup);

module.exports = router;