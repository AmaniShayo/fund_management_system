require('dotenv').config();
const express=require('express');
const Bugsnag = require('@bugsnag/js');
const BugsnagPluginExpress = require('@bugsnag/plugin-express');
const mongoose = require('mongoose');
const {authenticate} = require('./authenication/authenicate');
const { signUser } = require('./authenication/signUser');
const { Admin} = require('./database/queries/admin');
// Bugsnag.start({
//     apiKey: '467947fb47a4c0f2bca2aeea86dc0793',
//     plugins: [BugsnagPluginExpress]
//   });
const app = express();
// let bagsnagMiddleware = Bugsnag.getPlugin('express');
app.use(express.json());
// app.use(bagsnagMiddleware.requestHandler);
// app.use(bagsnagMiddleware.errorHandler);



app.get('/',(req,res)=>{
    res.end('welcome api services');
})

app.post('/api/login', async(req,res)=>{
    let status=await signUser(req.body.email,req.body.password,process.env.ACCESS_TOKEN);
    if (status=='passwordNotChanged') {
        res.redirect('/api/change-password');
    } else {
        res.json(status);
    }
})

app.post('/api/admin/add-user',authenticate, async(req,res)=>{
    await mongoose.connect('mongodb://localhost:27017/test-collection');
    let result = await Admin.createNewUser(req.body.data)
    res.json(result);
    res.end();
});

app.delete('/api/admin/remove-user',async(req,res)=>{
    await mongoose.connect('mongodb://localhost:27017/test-collection');
    let result = await Admin.removeUser(req.body.userId);
    res.json(result);
    res.end();
});

app.put('/api/admin/change-role', async(req,res)=>{
    await mongoose.connect('mongodb://localhost:27017/test-collection');
    let result = await Admin.changeUserRole(req.body.userId,req.body.newRole);
    res.json(result);
    res.end();
});

app.get('*',(req,res)=>{
    res.status(404).json({erroMessage:"content not found"});
    res.end();
})

app.listen(3000,()=>{
    console.log('listening on http://localhost/');
})