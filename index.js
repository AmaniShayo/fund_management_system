require('dotenv').config();
const express=require('express');
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
    res.json({message:"welcome to our api services"})
});

app.post('/api/login', signUser);

app.get('/api/generate-otp',queries.createOtp);

app.post('/api/forgot-password',queries.forgotPassword);

app.post('/api/change-password',queries.changePassword);

// app.use(authenticate);
app.use('/api/admin',roles.allowAdmin);
app.use('/api/finance-manager',roles.allowFinanceManager);

app.post('/api/stuff/sendrequest',queries.createFundRequest);

app.get('/api/admin/stuffs',queries.getAllUsers);

app.get('/api/admin/stuffs/:id',queries.getOneUser);

app.post('/api/admin/add-user',queries.createNewUser);

app.put('/api/admin/change-role',queries.changeUserRole);

app.delete('/api/admin/remove-user',queries.removeUser);

app.get('*',(req,res)=>{
    res.status(404).json({Message:"content not found"});
    res.end();
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log('listening on http://localhost/');
})