const { user } = require('../schemas');
let Admin = {
    createNewUser: async (userDetails) => {
        try {
            let newUser = new user(userDetails);
            await newUser.save();
            return newUser;
        } catch (error) {
            return error;
        }

    },
    removeUser: async (userId) => {
        try {
            await user.findOneAndDelete({ _id: userId });
        } catch (error) {
            return error
        }
    },
    changeUserRole: async (userId,newRole) => {
        try {
            if (newRole == 'admin') {
                return await user.findByIdAndUpdate(userId,{role:"admin"});
            } else if (newRole == 'finaceManager') {
                return await user.findByIdAndUpdate(userId,{role:"financeMane"});
            } else {
                return await user.findByIdAndUpdate(userId,{role:"stuff"});
            }
        } catch (error) {
            return error;
        }
    }
}

module.exports.Admin = Admin;