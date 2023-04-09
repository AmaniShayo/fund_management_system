const express = require('express');
const route = express.Router();
const controller = require('../controller/controller');
const authenticate = require('../controller/auth').authenticate;

route.post('/api/login', controller.login);

route.post('/api/user', authenticate, controller.role.admin, controller.user.create);

route.get('/api/user', authenticate, controller.role.admin, controller.user.read);

route.get('/api/user/:id', authenticate, controller.user.read);

route.put('/api/user/:id', authenticate, controller.role.admin, controller.user.read);

route.delete('/api/user/:id', authenticate, controller.role.admin, controller.user.delete);

module.exports = route;