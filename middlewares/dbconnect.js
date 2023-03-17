require('dotenv').config();
const mongoose = require('mongoose');
const { user } = require('../database/schemas');

const content = async (req, res, next) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test-collection');
        let Admin = user.findOne({ role: "admin" });
        let adminData = new user({
            firstName: process.env.FIRST_NAME,
            secondName: process.env.SECON_DNAME,
            lastName: process.env.LAST_NAME,
            phoneNumber: process.env.PHONE_NUMBER,
            passwordChanged: true,
            password: process.env.PASSWORD,
            emailAddress: process.env.EMAIL_ADDRESS,
            role: "admin"
        });
        if(!Admin){
            adminData.save();
            console.log("admin created successful");
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "internal server error" }).end();
        throw error;
    }
}

module.exports.connect = content;