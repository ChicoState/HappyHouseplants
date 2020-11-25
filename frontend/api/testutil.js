global.fetch = require('node-fetch');

let incrementalUserSuffix = 0;

function generateUsername() {
  incrementalUserSuffix += 1;
  return `_Test_${new Date().getTime()}_${incrementalUserSuffix}`;
}

module.exports = {
  generateUsername,
};
