global.fetch = require('node-fetch');
const { register, login } = require('../auth');

let incrementalUserSuffix = 0;

/**
 * Generates a random username for automated testing.
 * @returns {string} A random username.
 */
function generateUsername() {
  incrementalUserSuffix += 1;
  return `_Test_${new Date().getTime()}_${incrementalUserSuffix}`;
}

/**
 * Registers a new user account and logs into it.
 * @returns {Promise<string>} A Promise that resolves to the random
 * username upon successful login. */
function registerAndLogin() {
  return new Promise((loginResolved, rejected) => {
    const username = generateUsername();
    register(username, 'MyPassword', 'Hello', 'World')
      .then((registerStatus) => {
        if (registerStatus.success === true) {
          login(username, 'MyPassword')
            .then((loginStatus) => {
              if (loginStatus.success === true) {
                loginResolved({ username, password: 'MyPassword' });
              } else {
                rejected(Error(`Failed to login: ${loginStatus.userMessage}`));
              }
            })
            .catch((error) => {
              rejected(error);
            });
        } else {
          rejected(Error(`Failed to register: ${registerStatus.userMessage}`));
        }
      })
      .catch((error) => {
        rejected(error);
      });
  });
}

module.exports = {
  generateUsername,
  registerAndLogin,
};
