const { SERVER_ADDR } = require('../server');

/**
 * Global object that stores the user's authentication information. */
global.auth = {
  token: undefined,
};

/**
 * Performs an authenticated fetch that resolves to a raw response.
 * @param {*} url - The destination URL of the fetch.
 * @param {*} method - The method, such as GET, POST, DELETE, or PUT.
 * @param {*} body - Optional object to send in the request body. This
 * object will be serialized to JSON.
 * @returns {Promise} A Promise that resolves to the raw response of
 * the fetch. If the response is JSON and you want it parsed to an object,
 * you should use the `authFetch` function instead. */
function authFetchRaw(url, method = 'GET', body) {
  const authToken = global.auth.token;
  return new Promise((response, rejected) => {
    const request = {
      method,
      body: JSON.stringify(body),
      headers: { AuthToken: authToken, 'Content-Type': 'application/json' },
    };
    fetch(url, request)
      .then((res) => {
        if (res.ok) {
          response(res);
        } else {
          rejected(Error(`The fetch returned status ${res.status}`));
        }
      })
      .catch((reason) => {
        rejected(reason);
      });
  });
}

/**
 * Performs an authenticated fetch.
 * @param {*} url - The destination URL of the fetch.
 * @param {*} method - The method, such as GET, POST, DELETE, or PUT.
 * @param {*} body - Optional object to send in the request body. This
 * object will be serialized to JSON.
 * @returns {Promise} A Promise that resolves to the JSON-parsed response of
 * the fetch. */
function authFetch(url, method = 'GET', body) {
  const authToken = global.auth.token;
  return new Promise((response, rejected) => {
    const request = {
      method,
      body: JSON.stringify(body),
      headers: { AuthToken: authToken, 'Content-Type': 'application/json' },
    };
    fetch(url, request)
      .then((resRaw) => {
        if (resRaw.ok) {
          resRaw.json().then((res) => {
            response(res);
          })
            .catch((reason) => {
              rejected(reason);
            });
        } else {
          rejected(Error(`The fetch returned status ${resRaw.status}`));
        }
      })
      .catch((reason) => {
        rejected(reason);
      });
  });
}

/**
 * Gets information about the logged-in user.
 * @returns {Promise} A Promise that resolves to the information about the
 * logged-in user, or null if the user is not logged in.
 * The resolved object contains the following properties:
 *
 * `username` - The logged-in account's username.
 *
 * `firstName` - The first name of the user.
 *
 * `lastName` - The last name of the user.
 */
function getLoginInfo() {
  const authToken = global.auth.token;
  return new Promise((infoResolved, rejected) => {
    if (authToken) {
      authFetch(`${SERVER_ADDR}/login_info`)
        .then((res) => {
          infoResolved(res);
        })
        .catch((reason) => {
          rejected(reason);
        });
    } else {
      // Not logged in
      infoResolved(null);
    }
  });
}

/**
 * Logs into a user account.
 * @param {*} username The username of the account into which to login.
 * @param {*} password The password of the user account.
 * @returns {Promise} A Promise that resolves to a status object indicating
 * whether the login was successful. The status object always contains a
 * `success` property that is `true` is login was successful, otherwise false.
 * If login failed, a `userMessage` property will contain a human-readable explanation
 * of why login failed. If login was successful, then a `sessionAuthToken` property
 * will contain a token that can be used for future logins by calling `loginByToken`. */
function login(username, password) {
  return new Promise((statusResolved, rejected) => {
    fetch(`${SERVER_ADDR}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((resRaw) => resRaw.json())
      .then((status) => {
        if (status.success) {
          global.auth.token = status.sessionAuthToken;
        }
        statusResolved(status);
      })
      .catch((reason) => {
        rejected(reason);
      });
  });
}

/**
 * Logs into a user account by an authentication token.
 * @param {*} authToken The authentication token that was obtained by a previous
 * call to the `login` function.
 * @returns {Promise<boolean>} A Promise that resolves to `true` if the login
 * was successful, otherwise `false`. */
function loginByToken(authToken) {
  return new Promise((statusResolved, rejected) => {
    global.auth.token = authToken;
    if (authToken) {
      authFetch(`${SERVER_ADDR}/login_info`)
        .then((res) => {
          if (res && res !== null) {
            global.auth.token = authToken;
            statusResolved(true);
          } else {
            statusResolved(false);
          }
        })
        .catch((reason) => {
          rejected(reason);
        });
    } else {
      // Not logged in
      statusResolved(false);
    }
  });
}

/**
 * Logs out of a user account. */
function logout() {
  global.auth.token = undefined;
}

/**
 * Registers a new user account.
 * @param {*} username The account's username.
 * @param {*} password The plaintext password.
 * @param {*} firstName The first name of the account owner.
 * @param {*} lastName The last name of the account owner.
 * @returns {Promise} A Promise that resolves to a status object.
 * The resolved status object always contains a `success` property that is
 * `true` if registration was successful, otherwise false. If registration failed,
 * then there will be a `userMessage` property that contains a human-readable
 * explanation of why registration failed. */
function register(username, password, firstName, lastName) {
  return new Promise((statusResolved, rejected) => {
    fetch(`${SERVER_ADDR}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username, password, firstName, lastName,
      }),
    }).then((resRaw) => resRaw.json())
      .then((res) => {
        statusResolved(res);
      })
      .catch((reason) => {
        rejected(reason);
      });
  });
}

module.exports = {
  authFetch, authFetchRaw, login, loginByToken, logout, register, getLoginInfo,
};
