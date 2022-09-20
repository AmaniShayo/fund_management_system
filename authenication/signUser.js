const jwt = require('jsonwebtoken');
const {user}=require('../database/schemas');
const mongoose= require('mongoose');


async function signUser(email,userPassword,secretTocken){
    try {
        await mongoose.connect('mongodb://localhost:27017/test-collection');
        let userDetails=await user.findOne({emailAddress:email,password:userPassword},'role _id passwordChanged');
        if (userDetails.passwordChanged) {
            let token = await jwt.sign({userId:userDetails._id.toHexString()},secretTocken);
            return token;
        } else {
            return "passwordNotChanged";
        }
    } catch (error) {
        return error;
    }
}

// {expiresIn:'1m'}
module.exports={signUser}