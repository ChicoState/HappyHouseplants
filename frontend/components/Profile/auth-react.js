import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthBase from '../../api/auth';

const AUTH_TOKEN = 'auth_token';
const LoginContext = React.createContext(null);

function setAuthToken(authToken) {
  return AsyncStorage.setItem(AUTH_TOKEN, authToken);
}

function getAuthToken() {
  return AsyncStorage.getItem(AUTH_TOKEN);
}

function removeAuthToken() {
  return AsyncStorage.removeItem(AUTH_TOKEN);
}

function autoLogin() {
  return new Promise((statusResolved, rejected) => {
    getAuthToken()
      .then((authToken) => {
        AuthBase.loginByToken(authToken)
          .then((status) => {
            if (status) {
              global.afterLogin();
            }
            statusResolved(status);
          })
          .catch((error) => {
            console.error(`Failed to auto-login by existing token due to an error: ${error}`);
            rejected(error);
          });
      })
      .catch((error) => {
        console.error(`Failed to auto-login due to an error while retrieving the stored auth token: ${error}`);
        rejected(error);
      });
  });
}

function login(username, password) {
  return new Promise((statusResolved, rejected) => {
    AuthBase.login(username, password)
      .then((status) => {
        if (status.success) {
          setAuthToken(status.sessionAuthToken)
            .then(() => {
              global.afterLogin();
              statusResolved(status);
            })
            .catch((error) => {
              console.warn(`Successfully logged in, but there was an error while saving the session token: ${error}`);
              statusResolved(status);
            });
        } else {
          statusResolved(status);
        }
      })
      .catch((error) => {
        console.error(`Failed to login due to an error: ${error}`);
        rejected(error);
      });
  });
}

function logout() {
  return new Promise((resolved, rejected) => {
    removeAuthToken()
      .then(() => {
        AuthBase.logout();
        global.afterLogout();
        resolved();
      })
      .catch((error) => {
        console.error(`Failed to logout due to an error while removing the auth token: ${error}`);
        rejected(error);
      });
  });
}

module.exports = {
  LoginContext, autoLogin, login, logout,
};
