const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"]
    },
    secondName:{
        type:String,
        required:[true,"Second name is requred"]
    },
    lastName:{
        type:String,
        required:[true,"Last name is requred"]
    },
    phoneNumber:{
        type:Number,
        required:[true,"phone number is required"],
        unique:[true,"The phone number you entered is taken"]
    },
    emailAddress:{
        type:String,
        LowerCase:true,
        required:[true,"email addres is requred"],
        unique:[true,"That email address is taken"]
    },
    password:{
        default:"ipf-software",
        type:String,
        minLength:[4,"password should have atleast four characters"]
    },
    department:String,
    role:{
        type:String,
        default:"stuff"
    },
    dateJoined:{
        type:Date,
        immutable:true,
        default:()=> Date.now()
    }
});

const fundRequestSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    projectName:{
        type:String,
        required:true
    },
    amountRequired:{
        type:Number,
        required:[true,"amount is required"]
    },
    reason:{
        type:String,
        required:[true,"reason is requred"]
    },
    status:{
        type:String,
        default:"pending"
    }

});

const receiptSchema = new mongoose.Schema({
    requestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"requests"
    },
    amount:{
        type:Number,
        required:[true,"amount is required"]        
    },
    url:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:[true,"description is required"]
    }
});

const exemptionSchema = new mongoose.Schema({
    requestId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"requests"
    },
    amount:{
        type:Number,
        required:[true,"amount is required"]
    },
    reason:{
        type:String,
        required:[true,"reason is required"]
    },
    status:{
        type:String,
        default:"pending"
    }
});

const badgetSchema = new mongoose.Schema({
    month:{
        type:String,
        default:()=>{let date = new Date; return date.getMonth},
        immutable:true
    },
    badgetAmount:{
        type:Number,
        required:[true,"badget amount is required"]
    },
    carryIn:{
        type:Number,
        default:0
    },
    amountAvailable:{
        type:Number
    }
});

const departmentSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"deparment name is required"]
    }
})

const departmentBadgetSchema= new mongoose.Schema({
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"departments"
    },
    badgetAmount:{
        type:Number,
        required:[true,"amount is required"]
    },
    amountAvailable:{
        type:Number
    }
});

const projectSchema = new mongoose.Schema({
    projectName:{
        type:String,
        required:[true,"project name is required"]
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"departmentBadget"
    }
})

const expenditureSchema = new mongoose.Schema({
    amount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"requests"
    },
    spentOn:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"request"
    },
    date:{
        type:Date,
        default:()=> Date.now()
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"projects"
    }
});

let departments = mongoose.model('departments',departmentSchema);
let project = mongoose.model('projects',projectSchema);
let departmentBadget = mongoose.model('departmentBadget',departmentBadgetSchema);
let receipt = mongoose.model('recepts',receiptSchema);
let exepmption = mongoose.model('exemptions',exemptionSchema);
let expenditure = mongoose.model('expenditures',expenditureSchema);
let badget = mongoose.model('badget',badgetSchema);
let user = mongoose.model('users',userSchema);
let request=mongoose.model('fundRequests',fundRequestSchema);
module.exports={departments,user,request,badget,expenditure,exepmption,receipt,departmentBadget,project};