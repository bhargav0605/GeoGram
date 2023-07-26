const express = require('express');

const router = express.Router();

const userController = require('../controllers/users-controller');

router.get('/', userController.getUsers);
router.get('/login', userController.login);
router.post('/signup', userController.signup);

module.exports = router;