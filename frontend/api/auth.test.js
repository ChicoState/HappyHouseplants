const {
  register,
  login,
  getLoginInfo,
  logout,
} = require('./auth');
global.fetch = require('node-fetch');

let incrementalUserSuffix = 0;

function generateUsername() {
  incrementalUserSuffix += 1;
  return `_Test_${new Date().getTime()}_${incrementalUserSuffix}`;
}

it('Can register a new account', () => {
  const username = generateUsername();
  expect(register(username, 'MyPassword', 'Hello', 'World'))
    .resolves.toStrictEqual({ success: true });
});

it('Cannot register a new account with an existing username', (done) => {
  // Register once...
  const username = generateUsername();
  register(username, 'MyPassword', 'Hello', 'World')
    .then((status) => {
      expect(status).toStrictEqual({ success: true });

      // Register again
      register(username, 'MyOtherPassword', 'FName', 'LName')
        .then((status2) => {
          expect(status2.success).toBe(false);
          done();
        })
        .catch((error) => {
          done(error);
        });
    }).catch((error) => {
      done(error);
    });
});

it('Duplicate username detection is case-insensitive', (done) => {
  // Register once...
  const usernameUpper = generateUsername().toUpperCase();
  const usernameLower = usernameUpper.toLowerCase();
  register(usernameUpper, 'MyPassword', 'Hello', 'World')
    .then((status) => {
      expect(status).toStrictEqual({ success: true });

      // Register again, in a different case
      register(usernameLower, 'MyOtherPassword', 'FName', 'LName')
        .then((status2) => {
          expect(status2.success).toBe(false);
          done();
        })
        .catch((error) => {
          done(error);
        });
    }).catch((error) => {
      done(error);
    });
});

it('Can register then login', (done) => {
  // Register
  const username = generateUsername();
  register(username, 'MyPassword', 'Hello', 'World')
    .then((registerStatus) => {
      expect(registerStatus).toStrictEqual({ success: true });

      // Login
      login(username, 'MyPassword')
        .then((loginStatus) => {
          expect(loginStatus.success).toBe(true);
          expect(loginStatus.sessionAuthToken).toBeTruthy();

          // Prove login by getting account info
          getLoginInfo().then((loginInfo) => {
            expect(loginInfo).toBeTruthy();
            expect(loginInfo.username).toStrictEqual(username);
            expect(loginInfo.firstName).toStrictEqual('Hello');
            expect(loginInfo.lastName).toStrictEqual('World');
            done();
          })
            .catch((error) => {
              done(error);
            });
        })
        .catch((error) => {
          done(error);
        });
    })
    .catch((error) => {
      done(error);
    });
});

it('Can login then logout', (done) => {
  // Register
  const username = generateUsername();
  register(username, 'MyPassword', 'Hello', 'World')
    .then((registerStatus) => {
      expect(registerStatus).toStrictEqual({ success: true });

      // Login
      login(username, 'MyPassword')
        .then((loginStatus) => {
          expect(loginStatus.success).toBe(true);
          expect(loginStatus.sessionAuthToken).toBeTruthy();

          // Logout
          logout();

          // Expect no loginInfo after logging out
          getLoginInfo()
            .then((loginInfo) => {
              expect(loginInfo).toBeNull();
              done();
            })
            .catch((error) => {
              done(error);
            });
        })
        .catch((error) => {
          done(error);
        });
    })
    .catch((error) => {
      done(error);
    });
});

it('Can switch accounts', (done) => {
  // Register
  const username1 = generateUsername();
  register(username1, 'MyPassword1', 'Hello1', 'World1')
    .then((registerStatus1) => {
      expect(registerStatus1).toStrictEqual({ success: true });

      // Register another account
      const username2 = generateUsername();
      register(username2, 'MyPassword2', 'Hello2', 'World2')
        .then((registerStatus2) => {
          expect(registerStatus2).toStrictEqual({ success: true });

          // Login to username1
          login(username1, 'MyPassword1')
            .then((loginStatus1) => {
              expect(loginStatus1.success).toBe(true);
              expect(loginStatus1.sessionAuthToken).toBeTruthy();

              // Logout
              logout();

              // Login to username2
              login(username2, 'MyPassword2')
                .then((loginStatus2) => {
                  expect(loginStatus2.success).toBe(true);
                  expect(loginStatus2.sessionAuthToken).toBeTruthy();
                  getLoginInfo()
                    .then((loginInfo) => {
                      expect(loginInfo).toBeTruthy();
                      expect(loginInfo.username).toStrictEqual(username2);
                      expect(loginInfo.firstName).toStrictEqual('Hello2');
                      expect(loginInfo.lastName).toStrictEqual('World2');
                      done();
                    })
                    .catch((error) => {
                      done(error);
                    });
                })
                .catch((error) => {
                  done(error);
                });
            })
            .catch((error) => {
              done(error);
            });
        })
        .catch((error) => {
          done(error);
        });
    });
});
