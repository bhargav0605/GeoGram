const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload');

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

router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .isEmail().normalizeEmail(),
        check('password')
            .not()
            .isEmpty()
    ] ,
    userController.signup);

module.exports = router;