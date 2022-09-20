require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticate=(req,res,next)=>{
    const authHeader= req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    if (token== null) {
        res.status(401).json({message:"please provide access token"});
    } else {
     jwt.verify(token,process.env.ACCESS_TOKEN,(err,userDetail)=>{
        if (err) {
            res.status(403).json({message:"fobiden"});
        }
        res.userDetails=userDetail;
        next();
     })   
    }
}

module.exports={authenticate};