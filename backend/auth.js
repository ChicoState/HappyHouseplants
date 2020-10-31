const bcrypt = require('bcrypt');
const { SESSIONS } = require('./database/models/sessions');
const { USERS } = require('./database/models/users');
const { findDocuments } = require('./database/findDocuments');

const SALT_ROUNDS = 10; // TODO: Desired rounds for security?

/* Updates the 'lastLogin' property of a Session.
 * @param { session } The session to update.
 * @return { Promise } A Promise that resolves to the updated session. */
function keepaliveSession(session) {
  return new Promise((complete, error) => {
    const now = new Date();
    const { authToken } = session;
    SESSIONS.updateOne({ authToken }, {
      lastLoginDate: now,
    }).then(() => {
      console.log(`Extended session for user ID ${session.userId}.`);
      complete(session);
    }).catch((reason) => {
      console.error(`Failed to keepalive session with authentication token ${authToken} (for user ID ${session.userId}) due to an error: ${reason}`);
      error(reason);
    });
  });
}

/* Creates a session for an existing user account.
 * @param { userId } The ID of the user account for which to create the session.
 * @return { Promise } A Promise that resolves to the session's authentication token,
 * which the user will need for future session logins. */
function createSession(userId) {
  return new Promise((complete) => {
    const now = new Date();
    const crngToken = `Session_${now.getTime()}_${userId}`; // TODO: DO NOT USE THIS! Use CRNG
    console.error('Important note to devs: Right now, we are using non-CRNG session tokens. DO NOT LET THIS REACH PRODUCTION!');
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

/* Attempts to login to an existing user account, and creates a session if
 * the login was successful.
 * @param { username } The username of the account.
 * @param { password } The plaintext password.
 * @return { Promise } A Promise that resolves to an object with the following properties:
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
    findDocuments('Users', { username }).then((docs) => {
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

/* Registers a new user account.
 * @param { username } The desired username.
 * @param { password } The plaintext user password (which will be hashed+salted in storage).
 * @param { firstName } The user's first name.
 * @param { lastName } The user's last name.
 * @return { Promise } A Promise that resolves to an object with the following properties:
 * {
 *   success - True if the registration was successful.
 *   userMessage - Human readable error message that explains why registration failed, or null.
 * }
 * The returned Promise will be rejected only due to server errors.
 */
function register(username, password, firstName, lastName) {
  return new Promise((complete) => {
    findDocuments('Users', { username }).then((docs) => {
      if (docs.length === 0) {
        bcrypt.hash(password, SALT_ROUNDS).then((hashedPassword) => {
          USERS.insertMany({
            userId: username, // TODO: Let the DB assign a unique user ID?
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

/* Authenticates a HTTP request to determine the user ID who is logged in.
 * @param { req } The HTTP request object.
 * @param { res } The HTTP response object, to which authentication status
 * headers will be written. This function will not send anything to the
 * response directly, it will only append headers.
 * @return { Promise } A Promise that resolves to the user ID who sent the
 * request, or null if the request's authentication failed. The Promise
 * will only be rejected due to server errors, NOT due to authentication failure. */
function authenticateUserRequest(req, res) {
  console.log(`Received request: ${JSON.stringify(req.headers)}`);// TODO: Remove
  return new Promise((authComplete, authError) => {
    const authToken = req.headers.authtoken;
    if (!authToken) {
      // No Auth header provided
      console.log('No auth header'); // TODO: Remove
      res.setHeader('AuthStatus', false);
      authComplete(null);
    } else {
      const sessionQuery = { authToken };
      findDocuments('Sessions', sessionQuery).then((docs) => {
        if (docs.length === 0) {
          console.log('Session not found'); // TODO: Remove
          res.setHeader('AuthStatus', false);
          authComplete(null); // Auth token was provided, but not found in database
        } else if (docs.length === 1) {
          console.log('Session found'); // TODO: Remove
          const session = docs[0];
          keepaliveSession(session).then(() => {
            res.setHeader('AuthStatus', true);
            authComplete(session.userId);
          });
        } else {
          /* If we somehow made it here, then there are more than one sessions with
           * the same authToken. This means something really bad happend (perhaps CRNG
           * wasn't random). */
          console.error(`Found ${docs.length} sessions with the same authentication token: ${authToken}`);
          authError(new Error('Found multiple sessions with the same authentication token.'));
        }
      });
    }
  });
}

module.exports = { register, authenticateUserRequest, login };
