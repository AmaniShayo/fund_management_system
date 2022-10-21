const {project,user,request,badget,expenditure,reject,deparment,exepmption,receipt,projectBadget,otp,log} = require('./schemas')
const { inviteByEmail,otpEmail } = require('../mailer');
const { randomPassword,encript,otpGenarator} = require('../passwords');
const { compare } = require('bcryptjs');
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
            let result = await user.findOneAndUpdate({emailAddress:req.body.email},{role:req.body.newRole});
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
    getUsers: async (req,res)=>{
        let filter =  {"emailAddress":req.query.filter}|| {};
        console.log(filter);
        try {
            let result = await user.find(filter);
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
            res.json(error.message).end();
            return;
        }
    },
    forgotPassword:async (req,res)=>{
        try {
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
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    changePassword: async(req,res)=>{
        try {
            let userDetails= await user.findOne({emailAddress:req.user.email});
            if (!userDetails) {
                res.json({message:"user with given email was not found"}).end();
                return;
            }
            if (await compare(req.body.oldPassword,userDetails.password)) {
                await user.findOneAndUpdate({emailAddress:req.body.email},{password: await encript(req.body.newPassword),passwordChanged:true});
                res.json({message:"password changed"}).end();
                return;
            }
            res.json({message:"to change your password provide correct old password or try to recover your password if forgot"}).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    createFundRequest: async (req,res)=>{
        try {
            let userId= await user.findById(req.user.userId,"_id");
            if (!userId) {
                res.status(404).json({message:"user with given id is not found"}).end();
                return;
            }
            let requestData = req.body;
            if (!requestData) {
                res.json({message:"please provide request object"}).end();
                return;
            }
            let projectId= await project.findOne({name:requestData.projectName});
            if (!projectId) {
                res.json({message:"project specified was not found"}).end();
                return;
            }
            let newRequest = new request({
                userId:req.user.userId,
                project:projectId._id.toHexString(),
                amountRequired:requestData.amount,
                description:requestData.description
            });
            let result = await newRequest.save();
            res.json(result).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    editRequest:async (req,res)=>{
        try {
            let result= await request.findById(req.body.requestId);
            if (!result) {
                res.json({message:"request with given id was not found"}).end();
                return;
            }
            await request.findByIdAndUpdate(result._id.toHexString(),{
                project:req.body.project || result.project,
                amountRequired:req.body.amountRequired || result.amountRequired,
                description:req.body.description || result.description
            });
            res.json({message:"request edited successful"}).end();
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    getRequests:async (req,res)=>{
        try {
            let filter = req.body.filter || {};
            let result = await request.find(filter);
            if (!result) {
                res.json({message:"no requests found"})
            }
            res.json(result).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    approveRequest: async (req,res)=>{
        try {
            let result = await request.findByIdAndUpdate(req.params.id,{ status:"approved" });
            if (!result) {
                res.json({message:"request with given id was not found"}).end();
                return;
            }
            let newExpenditure = new expenditure({
                amount:result.amountRequired,
                badget:await badget.findOne({}).sort({created_at:-1}),
                project:result.project
            });
            await newExpenditure.save();
            res.json({message:"request approved successful"}).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    rejectRequest: async (req,res)=>{
        try {
            let result = await request.findByIdAndUpdate(req.params.id,{ status:"rejected" });
            if (!result) {
                res.json({message:"request with given id was not found"}).end();
                return;
            }
            let newReject = new reject({
                request:req.params.id,
                reason:req.body.reason
            });
            await newReject.save();
            res.json({message:"request was rejected"});
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    addProjects: async(req,res)=>{
        if (!req.body.projectName) {
            res.json({message:"provide project name"});
            return;
        }
        try {
            let newProject = new project({
                name:req.body.projectName
            });
            let result =await newProject.save();
            res.json(result).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    addDepartments: async (req,res)=>{
        if (!req.body.departmentName) {
            res.json({message:"provide department name"});
        }
        try {
            let newDepartment = new deparment({
                departmentName:req.body.departmentName
            });
            let result = await newDepartment.save();
            res.json(result).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    },
    addExemption: async (req,res)=>{
        try {
            let newExemption= new exepmption({
                requestId:req.body.requestId,
                amount:req.body.amount,
                reason:req.body.reason
            });
            let result = await newExemption.save();
            res.json(result);
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
        
    },
    viewLogs: async (req,res)=>{
        try {
            let result = await log.find({});
            if (!result) {
                res.json({message:"no logs availble"}).end();
                return;
            }
            res.json(result).end();
            return;
        } catch (error) {
            res.json(error);
            return;
        }
    }

        
}

module.exports.queries = queries;