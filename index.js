'use strict';

var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var oas3Tools = require('oas3-tools');
var Default = require('./controllers/default.js'); // Importar controladores

var serverPort = 8080;
var app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuración de Swagger Router
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var swaggerApp = expressAppConfig.getApp();

// Definir rutas manualmente (si deseas sobrescribir las de OpenAPI)
app.post('/auth/login', Default.authLoginPOST);
app.get('/hello/common', Default.helloCommonGET);
app.get('/hello/user1', Default.helloUser1GET);
app.get('/hello/user2', Default.helloUser2GET);

// Usar las rutas de Swagger generadas automáticamente
app.use(swaggerApp);

// Iniciar servidor
http.createServer(app).listen(serverPort, function () {
    console.log(`Server running on http://localhost:${serverPort}`);
    console.log(`Swagger UI available at http://localhost:${serverPort}/docs`);
});