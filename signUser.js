const jwt = require('jsonwebtoken');
const {user}=require('./database/schemas');
const { compare } = require('./passwords')
async function signUser(req,res){
    let email = req.body.email;
    let userPassword = req.body.password;
    try {
        let userDetails=await user.findOne({emailAddress:email},'password role _id passwordChanged');
        if (!userDetails) {
            res.status(404).json({meassage:"user with the given email address was not found"}).end();
            return;
        }
        if (userDetails.passwordChanged) {
            if (await compare(userPassword,userDetails.password)) {                
                let token = await jwt.sign({userId:userDetails._id.toHexString(),role:userDetails.role},process.env.ACCESS_TOKEN,{expiresIn:'10m'});
                res.status(200).json({token:token}).end();
                return;
            }
            res.status(403).json({message:"wrong password"}).end();
            return;
        } else {
            res.status(200).json({message:"plese change your password before loging in for the first time"}.end());
            return;
        }
    } catch (error) {
        res.status(500).json({message:"internal server error "}).end();
        return;
    }
}

module.exports={signUser}