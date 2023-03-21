const mongoose = require('mongoose');
const connect = async (req, res, next) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fund_management_system');
        next();
    } catch (error) {
        res.status(500).json({ message: "internal server error" }).end();
        throw error;
    }
}

module.exports = { connect };