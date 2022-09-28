let logger = async (req,res,next)=>{
    let data={}
    try {
        let date =()=>{return Date.now()};
        if (!req.user) {
            data.user="unknown user";
            data.url=req.url;
            data.date=date();
            data.ipAddress=req.ip;
            console.log(data);
            next();
            return;
        }
        data.user=req.user.userId;
        data.role=req.user.role;
        data.date=date();
        data.url=req.url;
        data.ipAddress=req.ip;
        console.log(data);
        next()
    } catch (error) {
        console.log(error);
    }
}

module.exports.logger=logger