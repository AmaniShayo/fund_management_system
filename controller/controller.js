const models = require('../model/schemas');
const jwt = require('jsonwebtoken');
const passwords = require('./passwords');
const inviteByEmail = require('../mailler/inviteByEmail').inviteByEmail;

exports.role = {
    admin: async (req, res, next) => {

        if (req.user.role === "Admin") {
            next();
        } else {
            res.status(401).json({ message: "unauthorised" }).end();
            return;
        }

    },
    financeManager: async (req, res, next) => {

        if (req.user.role === "Admin" || req.user.role === "financeManager") {
            next();
        } else {
            res.status(401).json({ message: "unauthorised" }).end();
            return;
        }

    }
}

exports.login = async (req,res)=>{
    try {

        let userDetails = await models.user.findOne({ emailAddress: req.body.email }).populate("role");
        if (!userDetails) {
            res.status(404).json({ status: 404, meassage:"user with the given email address was not found"}).end();
            return;
        }
        if (userDetails.passwordChanged) {
            if (await passwords.compare(req.body.password,userDetails.password)) {                
                let token = await jwt.sign({ userId: userDetails._id.toHexString(), role: userDetails.role.name, email: userDetails.emailAddress }, process.env.ACCESS_TOKEN, { expiresIn: "10h" });
                res.status(200).json({ token: token }).end();
                return;
            }
            res.status(403).json({ status: 403, message: "wrong password" }).end();
            return;
        }
        res.status(200).json({message:"please change your password before loging in for the first time"}).end();
        return;

    } catch (error) {

        res.status(500).json({message:"internal server error "}).end();
        return;

    }
}

exports.user = {
    create: async (req, res) => {
        try {

            let data = req.body;
            let password = passwords.randomPassword();
            data.password = await passwords.encript(password);
            let user = new models.user(data);
            user.save().then(data => {
                res.json(data).end();
            }).catch(err => {
                res.status(400).json(err.message).end();
            });
            inviteByEmail(data.email, password, data.firstName);
            return;

        } catch (error) {

            res.status(500).json({ message: "An error occured" }).end();
            return;

        }
    },
    read: async (req, res) => {
        try {

            if (req.params.id && req.params.id == req.user.id) {
                await models.user.findById(req.params.id).then(data => {
                    if (!data) {
                        res.status(404).json({ message: "user with given id was not found" }).end();
                        return;
                    } else {
                        res.json(data).end();
                        return;
                    }
                }).catch(err => {
                    res.status(400).json(err).end();
                });

            } else if (!req.params.id) {

                let filter = req.query || {}
                await models.user.find(filter).then(data => {
                    if (!data) {
                        res.status(404).json({ message: "not found" }).end();
                        return;
                    } else {
                        res.json(data).end();
                        return;
                    }
                }).catch(err => {
                    res.status(400).json(err).end();
                });
            }else {

                res.status(404).json({ message: "Not found" });

            }

        } catch (error) {

            res.status(500).json({ message: "An error occured" }).end();
            return;

        }
    },
    update: async (req, res) => {
        try {

            await models.user.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false }).then(data => {
                if (!data) {
                    res.status(404).json({message:"user with given id was not found"}).end();
                    return;
                } else {
                    res.json({message:"updated successful"}).end();
                    return;
                }
            }).catch(err => {
                res.status(400).json(err).end();
            });

        } catch (error) {
            
            res.status(500).json({ message: "An error occured" }).end();
            return;

        }
    },
    delete: async (req, res) => {
        try {

            await models.user.findByIdAndDelete(req.params.id).then(data => {
                if (!data) {
                    res.status(404).json({ message: "user not found" }).end();
                    return;
                } else {
                    res.json({ message: "user deleted successful" }).end();
                    return;
                }
            }).catch(err => {
                res.status(400).json(err).end();
            });
            return;

        } catch (error) {
            
            res.status(500).json({ message: "An error occured" }).end();
            return;

        }
    }

}

