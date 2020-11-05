import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_ADDR } from './server';

const SESSION_TOKEN = 'session_token';

const LoginContext = React.createContext(null);

function authFetch(url, method = 'GET', body) {
  return new Promise((response) => {
    AsyncStorage.getItem(SESSION_TOKEN).then((authToken) => {
      const request = {
        method,
        body: JSON.stringify(body),
        headers: new Headers({ AuthToken: authToken, 'Content-Type': 'application/json' }),
      };
      fetch(url, request).then((res) => {
        response(res);
      });
    });
  });
}

function getLoginInfo() {
  return new Promise((infoResolved) => {
    AsyncStorage.getItem(SESSION_TOKEN).then((authToken) => {
      if (authToken) {
        authFetch(`${SERVER_ADDR}/login_info`).then((resRaw) => resRaw.json()
          .then((res) => {
            infoResolved(res);
          }));
      } else {
        // Not logged in
        infoResolved(null);
      }
    });
  });
}

function login(username, password) {
  return new Promise((statusResolved) => {
    fetch(`${SERVER_ADDR}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((resRaw) => resRaw.json())
      .then((status) => {
        if (status.success) {
          AsyncStorage.setItem(SESSION_TOKEN, status.sessionAuthToken)
            .then(() => {
              statusResolved(status);
            });
        } else {
          statusResolved(status);
        }
      });
  });
}

function logout() {
  return AsyncStorage.removeItem(SESSION_TOKEN);
}

function register(username, password, firstName, lastName) {
  return new Promise((statusResolved) => {
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
      });
  });
}

module.exports = {
  authFetch, login, register, getLoginInfo, LoginContext, logout,
};
