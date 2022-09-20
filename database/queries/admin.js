const { user } = require('../schemas');
const { sendEmail } = require('../../mailer');
let Admin = {
    createNewUser: async (userDetails) => {
        try {
            let newUser = new user(userDetails);
            await newUser.save();
            sendEmail("admin",newUser.emailAddress,"login credentials",`use your email address and the password:${newUser.password} to login and change your password`);
            return newUser;
        } catch (error) {
            return error;
        }

    },
    removeUser: async (userId) => {
        try {
            return await user.findOneAndDelete({ _id: userId });
        } catch (error) {
            return error
        }
    },
    changeUserRole: async (userId,newRole) => {
        try {
            return await user.findByIdAndUpdate(userId,{role:`${newRole}`});
        } catch (error) {
            return error;
        }
    }
}

module.exports.Admin = Admin;