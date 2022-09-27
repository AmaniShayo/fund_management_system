let roles ={
    allowFinanceManager:(req,res,next)=>{
        if (req.user.role==="admin" || req.user.role==='financeManager') {
            next();
            return;
        }
        res.status(401).json({message:"unauthorised"}).end();
        return;
    },
    allowAdmin:(req,res,next)=>{
        if (req.user.role==="admin") {
            next();
            return;
        }
        res.status(401).json({message:"unauthorised"}).end();
        return;
    }
}


module.exports={roles};