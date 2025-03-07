'use strict';

module.exports.authLoginPOST = function authLoginPOST(body) {
  return Promise.resolve({ message: 'Login successful' });
};

module.exports.helloCommonGET = function helloCommonGET() {
  return Promise.resolve({ message: 'Hello, common user!' });
};

module.exports.helloUser1GET = function helloUser1GET() {
  return Promise.resolve({ message: 'Hello, User1!' });
};

module.exports.helloUser2GET = function helloUser2GET() {
  return Promise.resolve({ message: 'Hello, User2!' });
};
