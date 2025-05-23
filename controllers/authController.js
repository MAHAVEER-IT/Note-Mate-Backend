const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

const register = async(req,res)=>{
    try{
    const {username,email,password} = req.body;
    const userExists = await User.findOne({ $or:[{username},{email}] });

    if(userExists){
        return res.status(400).json({message:'User already exists'});
    }
    
    const user = await User.create({
        username,email,password
    });

    res.status(201).json({
        _id:user._id,
        username:user.username,
        email:user.email,
        token:generateToken(user._id),
    });
    } catch(error){
        res.status(400).json({message:error.message});
    }
};

const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(401).json({message:'Invalid email or password'});
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(401).json({message:'Invalid email or password'});
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    }catch(error){
        res.status(500).json({message:'Server error', error:error.message});
    }
}

module.exports = {
    register,
    login,
};