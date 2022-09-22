require('dotenv').config();
const express=require('express');
const Bugsnag = require('@bugsnag/js');
const BugsnagPluginExpress = require('@bugsnag/plugin-express');
const mongoose = require('mongoose');
const {authenticate} = require('./authentication');
const { signUser } = require('./signUser');
const { queries} = require('./database/queries');
const {access} = require('./access');
// Bugsnag.start({
//     apiKey: '467947fb47a4c0f2bca2aeea86dc0793',
//     plugins: [BugsnagPluginExpress]
//   });
const app = express();
// let bagsnagMiddleware = Bugsnag.getPlugin('express');
app.use(express.json());
// app.use(bagsnagMiddleware.requestHandler);
// app.use(bagsnagMiddleware.errorHandler);
app.use(async(req,res,next)=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/test-collection');
        next();
    } catch (error) {
        res.status(500).json({message:"internal server error"}).end();
    }
})

app.get('/',(req,res)=>{
    res.json({message:"welcome to our api services"})
});

app.post('/api/login', signUser);

app.use(authenticate);

app.use(access.staffAccess);

app.post('/api/stuff/sendrequest',queries.createFundRequest);

app.use(access.adminAccess);
app.get('/api/admin/staffs',queries.getAllUsers);

app.get('/api/admin/stuffs/:id',queries.getOneUser);

app.post('/api/admin/add-user',queries.createNewUser);

app.put('/api/admin/change-role',queries.changeUserRole);

app.delete('/api/admin/remove-user',queries.removeUser);


app.get('*',(req,res)=>{
    res.status(404).json({erroMessage:"content not found"});
    res.end();
})

app.listen(3000,()=>{
    console.log('listening on http://localhost/');
})