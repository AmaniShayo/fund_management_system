const jwt = require('jsonwebtoken');
const {user}=require('./database/schemas');
const { compare } = require('./passwords');
 const  login = async (req,res)=>{
    try {
        let userDetails=await user.findOne({emailAddress:req.body.email});
        if (!userDetails) {
            res.status(404).json({meassage:"user with the given email address was not found"}).end();
            return;
        }
        if (userDetails.passwordChanged) {
            if (await compare(req.body.password,userDetails.password)) {                
                let token = await jwt.sign({userId:userDetails._id.toHexString(),role:userDetails.role,email:userDetails.emailAddress},process.env.ACCESS_TOKEN,{expiresIn:"10h"});
                res.status(200).json({token:token}).end();
                return;
            }
            res.status(403).json({message:"wrong password"}).end();
            console.log(userDetails);
            return;
        }
        res.status(200).json({message:"plese change your password before loging in for the first time"}).end();
        return;
    } catch (error) {
        res.status(500).json({message:"internal server error "}).end();
        return;
    }
}

module.exports = { login };