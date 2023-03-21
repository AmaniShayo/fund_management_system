const { user, role, deparment } = require('./database/schemas');
const mongoose = require('mongoose');
const { encript } = require('./passwords');

const build = async (process, data) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fund_management_system');
        if (process == 'build') {
            let roles = new role({
                name: "Admin"
            });
    
            let departments = new deparment({
                departmentName: "Administration"
            });
            let adminData = new user({
                firstName: data.FIRST_NAME,
                secondName: data.SECOND_NAME,
                lastName: data.LAST_NAME,
                phoneNumber: data.PHONE_NUMBER,
                passwordChanged: true,
                password: await encript(data.PASSWORD),
                emailAddress: data.EMAIL_ADDRESS,
                role: roles._id.toHexString(),
                department: departments._id.toHexString(),
            });
            await departments.save();
            await roles.save();
            await adminData.save();
            console.log(adminData);
        } else {
            return;
        }
        
    } catch (error) {
        throw error;
    }
}

module.exports = { build };