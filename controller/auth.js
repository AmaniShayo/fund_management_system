require('dotenv').config({path:'../.env'});
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(403).json({ message: "please provide access token" }).end();
            return;
        } else {
            jwt.verify(token, process.env.ACCESS_TOKEN, (err, userDetail) => {
    
                if (err) {
                    res.status(403).json({ message: "fobiden" });
                    return;
                }
                req.user = userDetail;
                next();
            })
        }
    } catch (error) {
        res.status(500).json({ message: "An error occured" }).end();
        return;
    }
}