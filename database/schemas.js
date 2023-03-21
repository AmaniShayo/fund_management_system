const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        minlength: 3,
        type: String,
        required: [true, "First name is required"]
    },
    secondName: {
        type: String,
        minlength: 3,
        required: [true, "Second name is requred"]
    },
    lastName: {
        type: String,
        minlength: 3,
        required: [true, "Last name is requred"]
    },
    phoneNumber: {
        type: Number,
        required: [true, "phone number is required"],
        unique: [true, "The phone number you entered is taken"]
    },
    emailAddress: {
        type: String,
        LowerCase: true,
        validate: {
            validator: value => {
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (value.match(mailformat)) {
                    return true;
                } else {
                    return false;
                }
            },
            message: "Invalide email address"
        },
        required: [true, "email addres is requred"],
        unique: [true, "That email address is registered"]
    },
    password: {
        type: String,
        minLength: [4, "password should have atleast four characters"]
    },
    passwordChanged: {
        type: Boolean,
        default: false
    },
    department: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "depertment",
        required: true
    },
    role: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "roles",
        populate:true,
        default: "stuff"
    },
    dateJoined: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
});

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    }
});

const fundRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
        required: true
    },
    project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "projects",
        required: true
    },
    amountRequired: {
        type: Number,
        required: [true, "amount is required"]
    },
    description: {
        type: String,
        required: [true, "reason is requred"]
    },
    status: {
        type: String,
        default: "pending"
    },
    settled: {
        type: Boolean,
        default: false
    }

});

const receiptSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "fundRequests",
        required: true
    },
    amount: {
        type: Number,
        required: [true, "amount is required"]
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: [true, "description is required"]
    }
});

const exemptionSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "fundRequests",
        required: true
    },
    amount: {
        type: Number,
        required: [true, "amount is required"]
    },
    reason: {
        type: String,
        required: [true, "reason is required"]
    },
    approved: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "pending"
    }
});

const badgetSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
        immutable: true
    },
    badgetAmount: {
        type: Number,
        required: [true, "badget amount is required"]
    },
    carryIn: {
        type: Number,
        default: 0.0
    },
    amountAvailable: {
        type: Number
    }
});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "deparment name is required"]
    }
});

const projectBadgetSchema = new mongoose.Schema({
    project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "projects",
        required: true
    },
    badget: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "budgets",
        required: true
    },
    badgetAmount: {
        type: Number,
        required: [true, "amount is required"]
    },
    amountAvailable: {
        type: Number
    }
});

const expenditureSchema = new mongoose.Schema({
    amount: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: () => Date.now()
    },
    badget: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "badgets",
        required: true
    },
    project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "projects",
        required: true
    }
});

const otpSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    expireDate: {
        type: Date
    }
});

const deparmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
        unique:true
    }
});

const rejectSchema = new mongoose.Schema({
    request: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "fundRequests",
        required: true
    },
    reason: {
        type: String,
        required: [true, "please provide reason for rejection"]
    }
});

let logs = new mongoose.Schema({
    user: String,
    url: String,
    role: String,
    date: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    ipAddress: String
});

let role = mongoose.model('roles', roleSchema);
let log = mongoose.model('logs', logs);
let reject = mongoose.model("rejects", rejectSchema);
let deparment = mongoose.model("departments", deparmentSchema);
let otp = mongoose.model('otps', otpSchema);
let project = mongoose.model('projects', projectSchema);
let projectBadget = mongoose.model('projectBadgets', projectBadgetSchema);
let receipt = mongoose.model('recepts', receiptSchema);
let exepmption = mongoose.model('exemptions', exemptionSchema);
let expenditure = mongoose.model('expenditures', expenditureSchema);
let badget = mongoose.model('badgets', badgetSchema);
let user = mongoose.model('users', userSchema);
let request = mongoose.model('fundRequests', fundRequestSchema);
module.exports = { projectBadget, user, request, badget, expenditure, exepmption, receipt, project, otp, reject, deparment, log, role };