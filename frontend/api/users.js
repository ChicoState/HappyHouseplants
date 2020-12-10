const { SERVER_ADDR } = require('../server');

const { authFetch } = require('./auth');

/**
 * Updates properties for a user's profile.
 * @param {*} props An object with all of the properties that you want
 * to update, limited to any combination of the following:
 * `firstName`, `lastName`.
 * If you want to change the password, use `changePassword` instead.
 * @returns {Promise} A Promise that resolves when the user profile
 * has been updated. */
function updateUserProfile(props) {
  return authFetch(`${SERVER_ADDR}/login_info`, 'POST', props);
}

/**
 * Changes a user's password.
 * @param {String} newPassword The new plaintext password.
 * @returns {Promise} A Promise that resolves to a status object
 * with the following properties:
 *
 * `success` - True if the password was successfully changed, otherwise false.
 *
 * `userMessage` - Human-readable message that explains why the password could
 * not be changed, or null if the password was successfully changed.
 */
function changePassword(newPassword) {
  return authFetch(`${SERVER_ADDR}/change_password`, 'POST', { password: newPassword });
}

module.exports = {
  updateUserProfile,
  changePassword,
};
