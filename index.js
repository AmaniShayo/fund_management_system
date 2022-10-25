require('dotenv').config();
const express=require('express');
const {logger} = require("./logger");
const Bugsnag = require('@bugsnag/js');
const BugsnagPluginExpress = require('@bugsnag/plugin-express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const Documentation = require('./documentation/documentation.json');
const { authenticate } = require('./authentication');
const { signUser } = require('./signUser');
const { queries } = require('./database/queries');
const {user} = require('./database/schemas')
Bugsnag.start({
    apiKey: '467947fb47a4c0f2bca2aeea86dc0793',
    plugins: [BugsnagPluginExpress]
  });

const app = express();

let bagsnagMiddleware = Bugsnag.getPlugin('express');

app.use(express.json());

app.use(bagsnagMiddleware.requestHandler);
app.use(bagsnagMiddleware.errorHandler);

app.use(async(req,res,next)=>{

    try {
        await mongoose.connect('mongodb://localhost:27017/test-collection');
        next();
    } catch (error) {
        res.status(500).json({message:"internal server error"}).end();
    }
})

app.use(logger);
try {
    let checkAdmin = user.findOne({role:"admin"});
    let adminData = new user({
        firstName:process.env.FIRST_NAME,
        secondName:process.env.SECON_DNAME,
        lastName:process.env.LAST_NAME,
        phoneNumber:process.env.PHONE_NUMBER,
        passwordChanged:true,
        password:process.env.PASSWORD,
        emailAddress:process.env.EMAIL_ADDRESS,
        role:"admin"
    });        
    if(!checkAdmin){
        adminData.save();
        console.log("admin created successful");
    }
} catch (error) {
    throw error;
}
app.get('/',(req,res)=>{
    res.json({message:"welcome to our api services"});
});

app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(Documentation));

app.post('/api/login', signUser);

app.post('/api/generate-otp',queries.createOtp);

app.put('/api/forgot-password',queries.forgotPassword);

// app.use(authenticate);

app.put('/api/change-password',authenticate,queries.changePassword);

app.get('/api/logs',authenticate,queries.viewLogs);

app.get('/api/users',authenticate,queries.getUsers);

app.post('/api/users',authenticate,queries.createNewUser);

app.put('/api/users',authenticate,queries.changeUserRole);

app.delete('/api/users',authenticate,queries.removeUser);

app.post('/api/department',authenticate,queries.addDepartments);

app.post('/api/project',authenticate,queries.addProjects);

app.get('/api/request',authenticate,(req,res,next)=>{
    if (req.user.role != 'financeManager') {
        req.body.filter=req.user.usserId;
        next();
    }
    next();
},queries.getRequests);

app.put('/api/request/:id/approve',authenticate,queries.approveRequest);

app.put('/api/request/:id/reject',authenticate,queries.rejectRequest);

app.post('/api/request',authenticate,queries.createFundRequest);

app.put('/api/request',authenticate,queries.editRequest);

app.post('/api/badget',authenticate,queries.createBadget);

app.use('*',(req,res)=>{
    res.status(404).json({Message:"content not found"});
    res.end();
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log('listening on http://localhost/');
})