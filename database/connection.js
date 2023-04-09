const mongoose = require('mongoose');
const connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fund_management_system');
        console.log('connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connect;