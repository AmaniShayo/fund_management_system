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
        type:String,
        minLength:[4,"password should have atleast four characters"]
    },
    passwordChanged:{
        type:Boolean,
        default:false
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
    description:{
        type:String,
        required:[true,"reason is requred"]
    },
    status:{
        type:String,
        default:"pending"
    },
    settled:{
        type:Boolean,
        default:false
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

const categoriesSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"deparment name is required"]
    }
})

const itemsBadgetSchema= new mongoose.Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories"
    },
    badgetAmount:{
        type:Number,
        required:[true,"amount is required"]
    },
    amountAvailable:{
        type:Number
    }
});

const expenditureSchema = new mongoose.Schema({
    amount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"requests"
    },
    spentOn:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"request"
    },
    month:{
        type:String,
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"projects"
    }
});

const otpSchema= new mongoose.Schema({
    value:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    expireDate:{
        type:Date
    }
});

let otp=mongoose.model('otp',otpSchema);
let categories = mongoose.model('departments',categoriesSchema);
let itemsBadget = mongoose.model('itemsBadget',itemsBadgetSchema);
let receipt = mongoose.model('recepts',receiptSchema);
let exepmption = mongoose.model('exemptions',exemptionSchema);
let expenditure = mongoose.model('expenditures',expenditureSchema);
let badget = mongoose.model('badget',badgetSchema);
let user = mongoose.model('users',userSchema);
let request=mongoose.model('fundRequests',fundRequestSchema);
module.exports={itemsBadget,user,request,badget,expenditure,exepmption,receipt,categories,otp};