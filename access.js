let access ={
    staffAccess:(req,res,next)=>{
        if (req.user.role==='admin' || req.user.role==='stuff') {
            next();
            return;
        }
        res.status(403).json({message:"unauthorised"}).end();
        return;
    },
    financeManagerAccess:(req,res,next)=>{
        if (req.user.role==="admin" || req.user.role==='financeManager') {
            next();
            return;
        }
        res.status(403).json({message:"unauthorised"}).end();
        return;
    },
    adminAccess:(req,res,next)=>{
        if (req.user.role==="admin") {
            next();
            return;
        }
        res.status(403).json({message:"unauthorised"}).end();
        return;
    }
}


module.exports={access};