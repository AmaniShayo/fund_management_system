const express=require('express');
const { logger } = require("./middlewares/logger");
const Bugsnag = require('@bugsnag/js');
const BugsnagPluginExpress = require('@bugsnag/plugin-express');
const swaggerUi = require('swagger-ui-express');
const Documentation = require('./documentation/documentation.json');
const { authenticate } = require('./middlewares/authentication');
const { connect } = require('./middlewares/dbconnect');
const { login } = require('./login');
const { queries } = require('./database/queries');

Bugsnag.start({
    apiKey: '467947fb47a4c0f2bca2aeea86dc0793',
    plugins: [BugsnagPluginExpress]
  });

const app = express();

let bagsnagMiddleware = Bugsnag.getPlugin('express');

app.use(express.json());

app.use(bagsnagMiddleware.requestHandler);
app.use(bagsnagMiddleware.errorHandler);

app.use(connect);

app.use(logger);


app.get('/',(req,res)=>{
    res.json({message:"welcome to our api services"});
});

app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(Documentation));

app.post('/api/login', login);

app.post('/api/generate-otp', queries.createOtp);

app.put('/api/forgot-password', queries.forgotPassword);


app.put('/api/change-password', authenticate, queries.changePassword);

app.get('/api/logs', authenticate, queries.viewLogs);

app.get('/api/users', authenticate, queries.getUsers);

app.post('/api/users', authenticate, queries.createNewUser);

app.put('/api/users', authenticate, queries.changeUserRole);

app.delete('/api/users', authenticate, queries.removeUser);

app.post('/api/department', authenticate, queries.addDepartments);

app.post('/api/project', authenticate, queries.addProjects);

app.get('/api/request',authenticate,(req,res,next)=>{
    if (req.user.role != 'financeManager') {
        req.body.filter=req.user.usserId;
        next();
    }
    next();
},queries.getRequests);

app.put('/api/request/:id/approve', authenticate, queries.approveRequest);

app.put('/api/request/:id/reject', authenticate, queries.rejectRequest);

app.post('/api/request', authenticate, queries.createFundRequest);

app.put('/api/request', authenticate, queries.editRequest);

app.post('/api/badget', authenticate, queries.createBadget);

app.use('*',(req,res)=>{
    res.status(404).json({ Message: "content not found" });
    res.end();
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening on http://localhost/');
});