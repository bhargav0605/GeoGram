const HttpError = require('../models/http-error');

const { v4: uuidv4 } = require('uuid');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Iron Man',
        email: 'iron123@mail.com',
        password: 'iron123',
    }
];

const getUsers = (req, res, next)=>{
    res.json({users: DUMMY_USERS});
};

const login = (req, res, next)=>{
    const {email, password} = req.body;
    const user = DUMMY_USERS.find((u)=>{
        return u.email === email ;
    });
    if(!user || user.password !== password){
        throw new HttpError("Could not identify user, credentials seems to be wrong.", 401);
    }
    res.status(200).json({user});
};

const signup = (req, res, next)=>{
    const { name, email, password }= req.body;
    if(Object.keys(req.body).length === 0){
        throw new HttpError('No request body', 400);
    }
    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password
    }
    const user = DUMMY_USERS.find((u)=>{
        return u.email === email && u.password === password;
    });
    if(user){
        throw new HttpError("User already created, please login", 422);
    }
    DUMMY_USERS.push(createdUser);
    res.status(201).json({user: createdUser});
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;