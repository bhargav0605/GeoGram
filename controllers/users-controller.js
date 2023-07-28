const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Iron Man',
        email: 'iron123@mail.com',
        password: 'iron123',
    }
];

const getUsers = async (req, res, next)=>{
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError('Could not find all the users', 500);
        return next(error);
    }
    res.json({users: users.map(u=>u.toObject({getters: true}))});
};

const login = async (req, res, next)=>{
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (error) {
        const err = new HttpError('Logging in failed, plese try again', 500);
        return next(error);
    }

    if(!existingUser || existingUser.password !== password){
        return next( new HttpError("Invalid credentials seems to be wrong.", 401));
    }
    res.status(200).json({message: 'Logged in.'});
};

const signup = async (req, res, next)=>{

    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        return next(new HttpError('Invalid input, please check data.', 422));
    }

    const { name, email, password, places }= req.body;

    let existingUser
    try {
        existingUser = await User.findOne({email: email});
    } catch (error) {
        const err = new HttpError('Singing up failed, please try again later.',500);
        return next(err);
    }
    
    if(existingUser){
        const err = new HttpError('User alredy exist, please login.',422);
        return next(err);
    }

    const createdUser = new User({
        name,
        email,
        password,
        image: 'https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',
        places
    });

    try{
        await createdUser.save();
    }catch(error){
        const err = new HttpError('Signing up failed, plese try again', 500)
        return next(error);
    }

    res.status(201).json({user: createdUser.toObject({getters: true})});
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;