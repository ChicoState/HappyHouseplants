const { cryptoRandomHex } = require('crng');
const bcrypt = require('bcrypt');
const { SESSIONS } = require('../database/models/sessions');
const { USERS } = require('../database/models/users');
const { findDocuments, findOneDocument } = require('../database/findDocuments');

const SALT_ROUNDS = 12;

/** Updates the `lastLogin` property of a Session.
 * @param {*} session The session to update.
 * @returns { Promise } A Promise that resolves to the updated session. */
function keepaliveSession(session) {
  return new Promise((complete, error) => {
    const now = new Date();
    const { authToken } = session;
    SESSIONS.updateOne({ authToken }, {
      lastLoginDate: now,
    }).then(() => {
      complete(session);
    }).catch((reason) => {
      console.error(`Failed to keepalive session with authentication token ${authToken} (for user ID ${session.userId}) due to an error: ${reason}`);
      error(reason);
    });
  });
}

/** Creates a session for an existing user account.
 * @param { string } userId The ID of the user account for which to create the session.
 * @returns { Promise } A Promise that resolves to the session's authentication token,
 * which the user will need for future session logins. */
function createSession(userId) {
  return new Promise((complete) => {
    const now = new Date();
    const crngToken = cryptoRandomHex(32);
    const session = {
      authToken: crngToken,
      userId,
      creationDate: now,
      lastLoginDate: now,
    };
    SESSIONS.insertMany(session).then(() => {
      complete(session.authToken);
    });
  });
}

/** Attempts to login to an existing user account, and creates a session if
 * the login was successful.
 * @param { string } username The username of the account.
 * @param { string } password The plaintext password.
 * @returns { Promise } A Promise that resolves to an object with the following properties:
 * {
 *   success - True if login was successful
 *   userMessage - A user prompt that explains why login failed (or null upon success)
 *   sessionAuthToken - The auth token of the newly created session, or undefined upon failure
 * }
 * The Promise will resolve even if an incorrect password was supplied, so check the resolved
 * object's 'success' property to verify that login was successful.
 * The Promise will only be rejected due to server errors. */
function login(username, password) {
  return new Promise((complete, serverError) => {
    findDocuments('Users', { userId: username.toLowerCase() }).then((docs) => {
      if (docs.length === 0) {
        complete({ success: false, userMessage: 'The username is not recognized.' });
      } else if (docs.length === 1) {
        const user = docs[0];
        bcrypt.compare(password, user.password/* hashed+salted */).then((passResult) => {
          if (passResult) {
            // The password was correct, so create a session
            createSession(user.userId).then((sessionAuthToken) => {
              // Login successful
              console.log(`User ID ${user.userId} has logged in.`);
              complete({ success: true, userMessage: null, sessionAuthToken });
            }).catch((reason) => {
              // Failed to create a session due to server error
              console.error(`User ID ${user.userId} has successfully logged in, but the session could not be created due to an error: ${reason}`);
              serverError(reason);
            });
          } else {
            // The password was incorrect
            console.log(`User ID ${user.userId} entered the wrong password.`);
            complete({ success: false, userMessage: 'Invalid password' });
          }
        });
      } else {
        serverError(new Error(`Found multiple ${docs.length} user profiles with the same username: ${username}`));
      }
    });
  });
}

/** Registers a new user account.
 * @param { string } username The desired username.
 * @param { string } password The plaintext user password (which will be hashed+salted in storage).
 * @param { string } firstName The user's first name.
 * @param { string } lastName The user's last name.
 * @returns { Promise } A Promise that resolves to an object with the following properties:
 * {
 *   success - True if the registration was successful.
 *   userMessage - Human readable error message that explains why registration failed, or null.
 * }
 * The returned Promise will be rejected only due to server errors.
 */
function register(username, password, firstName, lastName) {
  return new Promise((complete) => {
    findDocuments('Users', { userId: username.toLowerCase() }).then((docs) => {
      if (docs.length === 0) {
        bcrypt.hash(password, SALT_ROUNDS).then((hashedPassword) => {
          USERS.insertMany({
            userId: username.toLowerCase(),
            username,
            password: hashedPassword,
            firstName,
            lastName,
          }).then(() => {
            complete({ success: true });
          });
        });
      } else {
        complete({ success: false, userMessage: 'The username already exists.' });
      }
    });
  });
}

/**
 * Updates the state of a `User` document.
 * @param {string} userId The userId of the `User` document to update.
 * @param {*} state The new state of the `User` document.
 * @returns {Promise} A Promise that resolves when the state has been saved.
 */
function updateUserDocument(userId, state) {
  return new Promise((resolved, rejected) => {
    if (!userId) {
      rejected(Error('Invalid userId'));
    } else {
      const query = { userId };
      USERS.updateOne(query, state).then(() => {
        resolved();
      }).catch((saveError) => {
        console.error(`Failed to update the User document for ${userId} due to an error: ${saveError}`);
        rejected(saveError);
      });
    }
  });
}

/** Authenticates a HTTP request to determine the user ID who is logged in.
 * @param { Request } req The HTTP request object.
 * @param { Response } res The HTTP response object, to which authentication status
 * headers will be written. This function will not send anything to the
 * response directly, it will only append headers.
 * @returns { Promise } A Promise that resolves to the `User` document that defines who
 * sent the request, or null if the request's authentication failed. The Promise
 * will only be rejected due to server errors, NOT due to authentication failure.
 * Note that the `password` field of the resolved `User` document will be omitted. */
function authenticateUserRequest(req, res) {
  return new Promise((authComplete, authError) => {
    const authToken = req.headers.authtoken;
    if (!authToken) {
      // No Auth header provided
      authComplete(null);
    } else {
      const sessionQuery = { authToken };
      findOneDocument('Sessions', sessionQuery)
        .then((session) => {
          if (session) {
            keepaliveSession(session)
              .then(() => {
                findOneDocument('Users', { userId: session.userId })
                  .then((userDoc) => {
                    if (userDoc) {
                      res.setHeader('AuthStatus', true);
                      const toReturn = userDoc;
                      delete toReturn.password; // Don't include sensitive info, even if it's hashed
                      authComplete(userDoc);
                    } else {
                      console.error(`Failed to find user document for userID ${session.userId}.`);
                      authError(Error('Failed to find the user document'));
                    }
                  })
                  .catch((error) => {
                    console.error(`Failed to find the user document for user ID ${session.userId} due to an error: ${error}`);
                    authError(Error('Failed to find the user document'));
                  });
              })
              .catch((error) => {
                console.error(`Failed to authenticate the user request because session keepalive failed due to an error: ${error}`);
                authError(Error('Failed to keepalive the session'));
              });
          } else {
            // Invalid auth token
            console.warn(`Did not find any session for auth token ${authToken}`);
            authComplete(null);
          }
        })
        .catch((error) => {
          console.error(`Failed to find the session document with token ${authToken} due to an error: ${error}`);
          authError(Error('Failed to find the session document'));
        });
    }
  });
}

/**
 * Registers a method+route handler with authentication.
 * @param {*} app The express app instance.
 * @param {string} method The HTTP method, such as GET, POST, PUT, or DELETE.
 * @param {string} route The path to the route.
 * @param {function} handler The function that will handle the request. The arguments
 * to this function are:
 *
 * `req` - The `Request` object.
 *
 * `res` - The `Response` object.
 *
 * `userDoc` - The `User` document, or null if authentication failed and `loginRequired` was false.
 *
 * @param {boolean} loginRequired Should all authentication failures result in a 403 status code?
 * If true, then the `handler` will not be called for requests with invalid authentication.
 */
function authMethod(app, method, route, handler, loginRequired) {
  app[method.toLowerCase()](route, (req, res) => {
    authenticateUserRequest(req, res)
      .then((userDoc) => {
        if (userDoc === null && loginRequired) {
          console.warn(`${method} request at route '${route}' failed authentication.`);
          res.status(403).json({});
        } else {
          handler(req, res, userDoc);
        }
      })
      .catch((error) => {
        console.error(`Failed to authenticate user ${method} request at route '${route}' due to an error: ${error}`);
        res.status(500).json({});
      });
  });
}
/**
 * Registers a GET route handler with authentication.
 * @param {*} app The express app instance.
 * @param {string} route The path to the route.
 * @param {function} handler The function that will handle the request. The arguments
 * to this function are:
 *
 * `req` - The `Request` object.
 *
 * `res` - The `Response` object.
 *
 * `userDoc` - The `User` document, or null if authentication failed and `loginRequired` was false.
 *
 * @param {boolean} loginRequired Should all authentication failures result in a 403 status code?
 * If true, then the `handler` will not be called for requests with invalid authentication.
 */
function authGet(app, route, handler, loginRequired = true) {
  authMethod(app, 'get', route, handler, loginRequired);
}

/**
 * Registers a POST route handler with authentication.
 * @param {*} app The express app instance.
 * @param {string} route The path to the route.
 * @param {function} handler The function that will handle the request. The arguments
 * to this function are:
 *
 * `req` - The `Request` object.
 *
 * `res` - The `Response` object.
 *
 * `userDoc` - The `User` document, or null if authentication failed and `loginRequired` was false.
 *
 * @param {boolean} loginRequired Should all authentication failures result in a 403 status code?
 * If true, then the `handler` will not be called for requests with invalid authentication.
 */
function authPost(app, route, handler, loginRequired = true) {
  authMethod(app, 'post', route, handler, loginRequired);
}

/**
 * Registers a PUT route handler with authentication.
 * @param {*} app The express app instance.
 * @param {string} route The path to the route.
 * @param {function} handler The function that will handle the request. The arguments
 * to this function are:
 *
 * `req` - The `Request` object.
 *
 * `res` - The `Response` object.
 *
 * `userDoc` - The `User` document, or null if authentication failed and `loginRequired` was false.
 *
 * @param {boolean} loginRequired Should all authentication failures result in a 403 status code?
 * If true, then the `handler` will not be called for requests with invalid authentication.
 */
function authPut(app, route, handler, loginRequired = true) {
  authMethod(app, 'put', route, handler, loginRequired);
}

/**
 * Registers a DELETE route handler with authentication.
 * @param {*} app The express app instance.
 * @param {string} route The path to the route.
 * @param {function} handler The function that will handle the request. The arguments
 * to this function are:
 *
 * `req` - The `Request` object.
 *
 * `res` - The `Response` object.
 *
 * `userDoc` - The `User` document, or null if authentication failed and `loginRequired` was false.
 *
 * @param {boolean} loginRequired Should all authentication failures result in a 403 status code?
 * If true, then the `handler` will not be called for requests with invalid authentication.
 */
function authDelete(app, route, handler, loginRequired = true) {
  authMethod(app, 'delete', route, handler, loginRequired);
}

module.exports = {
  register,
  authenticateUserRequest,
  login,
  authGet,
  authPost,
  authPut,
  authDelete,
  updateUserDocument,
};
