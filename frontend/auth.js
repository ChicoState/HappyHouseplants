import { AsyncStorage } from 'AsyncStorage';

function authFetch(url, method = 'GET', body) {
  return new Promise((response) => {
    AsyncStorage.getItem('session_token').then((authToken) => {
      const request = {
        method,
        body,
        headers: new Headers({ AuthToken: authToken }),
      };
      fetch(url, request).then((res) => {
        response(res);
      });
    });
  });
}

module.exports = { authFetch };
