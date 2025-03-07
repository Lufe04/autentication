'use strict';

const utils = require('../utils/writer.js');
const Default = require('../service/DefaultService');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'tu_secreto_seguro'; // Debes almacenar esto de manera segura en producción

// Middleware para verificar JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
}

// Login - Genera un JWT para un usuario específico
module.exports.authLoginPOST = function authLoginPOST(req, res, next) {
  const { username, password } = req.body;

  // Simulación de credenciales (debería ir a una base de datos)
  const users = {
    user1: { username: 'user1', password: 'pass1', role: 'user1' },
    user2: { username: 'user2', password: 'pass2', role: 'user2' }
  };

  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Crear el token
  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
};

// Endpoint accesible para cualquier usuario autenticado
module.exports.helloCommonGET = [verifyToken, function (req, res, next) {
  Default.helloCommonGET()
    .then(response => utils.writeJson(res, response))
    .catch(response => utils.writeJson(res, response));
}];

// Endpoint exclusivo para usuario1
module.exports.helloUser1GET = [verifyToken, function (req, res, next) {
  if (req.user.role !== 'user1') {
    return res.status(403).json({ message: 'Access denied' });
  }

  Default.helloUser1GET()
    .then(response => utils.writeJson(res, response))
    .catch(response => utils.writeJson(res, response));
}];

// Endpoint exclusivo para usuario2
module.exports.helloUser2GET = [verifyToken, function (req, res, next) {
  if (req.user.role !== 'user2') {
    return res.status(403).json({ message: 'Access denied' });
  }

  Default.helloUser2GET()
    .then(response => utils.writeJson(res, response))
    .catch(response => utils.writeJson(res, response));
}];
