const {departments,user,request,badget,expenditure,exepmption,receipt,departmentBadget,project,otp} = require('./schemas')
const { inviteByEmail,otpEmail } = require('../mailer');
const { randomPassword,encript,otpGenarator} = require('../passwords');
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
                    emailAddress:data.emailAddress,
                    role:data.role,
                    department:data.department,
                    password:encriptedPassword
                }
            );
            await newUser.save();
            inviteByEmail(newUser.emailAddress,data.Password,newUser.firstName);
            res.json(newUser).end();
            return;
        } catch (error) {
            res.json(error.message).end();
            return;
        }
    
    },
    removeUser: async (req,res) => {
        try {
            let result =await user.findOneAndDelete({ _id: req.body.userId });
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
            let result = await user.findById(req.user.userId,'emailAddress');
            if (!result) {
                res.status(404).json({meaasage:"user with given id was not found"});
                return;
            }
            let otpCode=otpGenarator();
            let newOtp = new otp(
                {
                    value:otpCode.value,
                    email:result.emailAddress,
                    expireDate:otpCode.expiresIn
                }
            );
            await newOtp.save();
            otpEmail(newOtp.email,newOtp.value);
            res.json({message:"One Time Password is sent to your email Address, please use it to reset your password. The code expires in 10 minutes"}).end();
            return;
        } catch (error) {
            res.json(error.meaasage);
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

//     addRecept:async (recentRequestId,receiptData)=>{
//         try {
//             let receiptDataObject={
//                 requestId:request.findById(recentRequestId),
//                 amount:receiptData.amount,
//                 url:receiptData.url,
//                 description:receiptData.description
//             }
//             let newReceipt = new receipt(receiptDataObject)
//             await newReceipt.save()
//         } catch (error) {
//             return error;
//         }
//     }
// }

module.exports.queries = queries;