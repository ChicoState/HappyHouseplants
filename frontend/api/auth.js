const { SERVER_ADDR } = require('../server');

global.auth = {
  token: undefined,
};

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
        response(res);
      })
      .catch((reason) => {
        rejected(reason);
      });
  });
}

function authFetch(url, method = 'GET', body) {
  const authToken = global.auth.token;
  return new Promise((response, rejected) => {
    const request = {
      method,
      body: JSON.stringify(body),
      headers: { AuthToken: authToken, 'Content-Type': 'application/json' },
    };
    fetch(url, request)
      .then((resRaw) => resRaw.json())
      .then((res) => {
        response(res);
      })
      .catch((reason) => {
        rejected(reason);
      });
  });
}

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

function logout() {
  global.auth.token = undefined;
}

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
