const { log } = require('../model/schemas');

exports.logger = async (req,res,next)=>{
    try {
        if (!req.user) {
            next();
        } else {
            let newLog = new log({
                user:req.user.userId,
                role:req.user.role,
                ipAddress:req.ip,
                url:req.url
            });
            await newLog.save();
            next();
        }
    } catch (error) {
        console.log(error);
        next();
    }
}