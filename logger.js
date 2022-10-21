const { log } = require('./database/schemas');
let logger = async (req,res,next)=>{
    try {
        if (!req.user) {
            let newLog = new log({
                user:"unknown user",
                ipAddress:req.ip,
                url:req.url
            });
            await newLog.save();
            next();
            return;
        }
        let newLog = new log({
            user:req.user.userId,
            role:req.user.role,
            ipAddress:req.ip,
            url:req.url
        });
        await newLog.save();
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports.logger=logger