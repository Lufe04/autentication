'use strict';

const jwt = require('jsonwebtoken');
const secretKey = "supersecreto"; // Clave secreta para firmar los JWT

// Usuarios y sus roles
const users = {
  usuario1: { password: "user1", role: "user1" },
  usuario2: { password: "user2", role: "user2" }
};

/**
 * Obtener un token JWT
 * Endpoint para generar un token JWT con usuario y contraseña
 *
 * body Auth_login_body
 * returns inline_response_200
 **/
exports.authLoginPOST = function (body) {
  return new Promise(function (resolve, reject) {
    if (users[body.username] && users[body.username].password === body.password) {
      const token = jwt.sign({ user: body.username, role: users[body.username].role }, secretKey, { expiresIn: "1h" });
      resolve({ access_token: token });
    } else {
      reject({ status: 401, message: "Usuario o contraseña incorrectos" });
    }
  });
};

// Middleware para validar JWT y rol
function validateJWT(event, roleRequired) {
  return new Promise((resolve, reject) => {
    const token = event.headers["Authorization"]?.split(" ")[1];
    if (!token) return reject({ status: 401, message: "Token no proporcionado" });

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return reject({ status: 403, message: "Token inválido" });
      if (roleRequired && decoded.role !== roleRequired) {
        return reject({ status: 403, message: "Acceso no autorizado" });
      }
      resolve(decoded);
    });
  });
}

/**
 * Saludo disponible para ambos usuarios
 *
 * returns inline_response_200_3
 **/
exports.helloCommonGET = function (event) {
  return validateJWT(event).then(() => {
    return { message: "Hola a ambos usuarios" };
  });
};

/**
 * Saludo exclusivo para Usuario 1
 *
 * returns inline_response_200_1
 **/
exports.helloUser1GET = function (event) {
  return validateJWT(event, "exclusive1").then(() => {
    return { message: "Hola Usuario 1" };
  });
};

/**
 * Saludo exclusivo para Usuario 2
 *
 * returns inline_response_200_2
 **/
exports.helloUser2GET = function (event) {
  return validateJWT(event, "exclusive2").then(() => {
    return { message: "Hola Usuario 2" };
  });
};
