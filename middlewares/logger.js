const { log } = require('../database/schemas');
let logger = async (req,res,next)=>{
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
        res.json({ message: error.message });
    }
}

module.exports.logger = logger;