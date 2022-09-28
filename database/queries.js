const {categories,user,request,badget,expenditure,exepmption,receipt,itemsBadget,otp} = require('./schemas')
const { inviteByEmail,otpEmail } = require('../mailer');
const { randomPassword,encript,otpGenarator} = require('../passwords');
const { compare, hash } = require('bcryptjs');
const queries ={
    createNewUser: async (req,res)=>{
        try {
            let data = req.body;
            if (!data.password) {
                data.password = randomPassword();
            }
            let encriptedPassword=await encript(data.password);
            let newUser = new user(
                {
                    firstName:data.firstName,
                    secondName:data.secondName,
                    lastName:data.lastName,
                    phoneNumber:data.phoneNumber,
                    emailAddress:data.email,
                    role:data.role,
                    department:data.department,
                    password:encriptedPassword
                }
            );
            await newUser.save();
            inviteByEmail(newUser.emailAddress,data.password,newUser.firstName);
            res.json(newUser).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    
    },
    removeUser: async (req,res) => {
        try {
            let result =await user.findOneAndDelete({ emailAddress: req.body.email });
            if (!result) {
                res.status(404).json({meaasage:"user with given email was not found"}).end();
                return;
            }
            res.json(result).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    changeUserRole: async (req,res) => {
        try {
            let result = await user.findByIdAndUpdate(req.body.userId,{role:req.body.newRole});
            if (!result) {
                res.status(404).json({meaasage:"user with given id was not found"}).end();
                return;
            }
            res.json(result).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    getAllUsers: async (req,res)=>{
        try {
            let result = await user.find({});
            res.json(result).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    getOneUser: async (req,res)=>{
        try {
            let result = await user.findById(req.params.id);
            if (!result) {
                res.status(404).json({meaasage:"user with given id was not found"}).end();
                return;
            }
            res.json(result).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    createOtp: async (req,res)=>{
        try {
            let result = await user.findOne({emailAddress:req.body.email});
            if (!result) {
                res.status(404).json({meaasage:"user with given email address was not found"}).end();
                return;
            }
            let otpCode=otpGenarator();
            let newOtp = new otp(
                {
                    value:otpCode.value,
                    email:req.body.email,
                    expireDate:otpCode.expiresIn
                }
            );
            await newOtp.save();
            otpEmail(result.emailAddress,newOtp.value);
            res.json({message:"One Time Password is sent to your email Address, please use it to reset your password. The code expires in 10 minutes"}).end();
            return;
        } catch (error) {
            res.json(error.meaasage);
            return;
        }
    },
    forgotPassword:async (req,res)=>{
        let userOtp = await otp.findOne({email:req.body.email});
        if (!userOtp) {
            res.json({message:"please generate OTP to change your password"}).end();
            return;
        }
        if (Date.now>userOtp.expireDate) {
            await otp.findOneAndDelete({email:req.body.email});
            res.json({message:"OTP expired please generate new OTP to reset your password "}).end();
            return;
        }
        if (userOtp.value==req.body.otp) {
            await user.findOneAndUpdate({emailAddress:req.body.email},{password:await encript(req.body.newPassword),passwordChanged:true});
            await otp.findOneAndDelete({email:req.body.email});
            res.json({message:"you have successful recoverd your password"}).end();
            return;
        }
        res.json({message:"please provide correct OTP"}).end();
        return;
    },
    changePassword: async(req,res)=>{
        let userDetails= await user.findOne({emailAddress:req.body.email});
        if (!userDetails) {
            res.json({message:"user with given id was not found"}).end();
            return;
        }
        if (await compare(req.body.oldPassword,userDetails.password)) {
            await user.findOneAndUpdate({emailAddress:req.body.email},{password: await encript(req.body.newPassword),passwordChanged:true});
            res.json({message:"password changed"}).end();
            return;
        }
        res.json({message:"to change your password provide correct old password or try to recover your password if forgot"}).end();
        return;
    },
    createFundRequest: async (req,res)=>{
        try {
            let userId= await user.findById(req.user.userId,"_id");
            if (!userId) {
                res.status(404).json({message:"user with given id is not found"}).end();
                return;
            }
            let requestObject = req.body;
            let newRequest = new request({
                userId:userId,
                projectName:requestObject.projectName,
                amountRequired:requestObject.amountRequired,
                description:requestObject.description
            });
            await newRequest.save();
            res.json(newRequest).end();
            return;
        } catch (error) {
            res.json(error).end();
            return;
        }
    }
        
}

module.exports.queries = queries;