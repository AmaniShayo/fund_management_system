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
const { roles } = require('./access');
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
app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(Documentation));
app.get('/',(req,res)=>{
    res.json({message:"welcome to our api services"});
});

app.post('/api/login', signUser);

app.post('/api/generate-otp',queries.createOtp);

app.put('/api/forgot-password',queries.forgotPassword);


app.use(authenticate);
app.use(logger);

app.put('/api/change-password',queries.changePassword);
// access control
app.use('/api/admin',roles.allowAdmin);
app.use('/api/finance',roles.allowFinanceManager);

// admin roles
app.get('/api/admin/users',queries.getUsers);

app.post('/api/admin/users',queries.createNewUser);

app.post('/api/admin/department',queries.addDepartments);

app.post('/api/admin/project',queries.addProjects);

app.put('/api/admin/user/role',queries.changeUserRole);

app.delete('/api/admin/user',queries.removeUser);

// financeManager roles
app.get('/api/finance/requests',queries.getRequests);

app.put('/api/finance/request/:id/approve',queries.approveRequest);

app.put('/api/finance/request/:id/reject',queries.rejectRequest);

// stuff roles
app.get('/api/user/request',(req,res,next)=>{req.body.filter=req.user.usserId;next()},queries.getRequests);

app.post('/api/user/request',queries.createFundRequest);

app.put('/api/user/request',queries.editRequest);

app.use('*',(req,res)=>{
    res.status(404).json({Message:"content not found"});
    res.end();
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log('listening on http://localhost/');
})