const express = require('express');
const route = express.Router();
const controller = require('../controller/controller');
const authenticate = require('../controller/auth').authenticate;
const log = require('../controller/logger').logger;

route.post('/api/login', log, controller.login);

route.post('/api/user', log, authenticate, controller.permission.admin, controller.user.create);

route.get('/api/user', log, authenticate, controller.permission.admin, controller.user.read);

route.get('/api/user/:id', log, authenticate, controller.user.read);

route.put('/api/user/:id', log, authenticate, controller.permission.admin, controller.user.read);

route.delete('/api/user/:id', log, authenticate, controller.permission.admin, controller.user.delete);

module.exports = route;