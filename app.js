require('dotenv').config();
require('./database/connection')();
const port = process.env.PORT || 3000;
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const documentation = require('./routes/documentation.json');
const routes = require('./routes/router');
const app = express();

app.use(express.json());

app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(documentation));

app.use('/', routes);

app.use('*', (req, res) => {
    res.status(404).json({ status: 404, Message: "content not found" });
    res.end();
});

app.listen(port, () => {
    console.log('listening on http://localhost/');
});
