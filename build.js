require('dotenv').config();
const { user, role, deparment } = require('./model/schemas');
const mongoose = require('mongoose');
const { encript } = require('./controller/passwords');

const build = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fund_management_system');
        let roles = new role({
            name: "Admin"
        });
        let departments = new deparment({
            departmentName: "Administration"
        });
        let adminData = new user({
            firstName: process.env.FIRST_NAME,
            secondName: process.env.SECOND_NAME,
            lastName: process.env.LAST_NAME,
            phoneNumber: process.env.PHONE_NUMBER,
            passwordChanged: true,
            password: await encript(process.env.PASSWORD),
            emailAddress: process.env.EMAIL_ADDRESS,
            role: roles._id.toHexString(),
            department: departments._id.toHexString(),
        });
        await departments.save();
        await roles.save();
        await adminData.save();
        console.log(adminData);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

build();