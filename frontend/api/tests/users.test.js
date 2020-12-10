const {
  login,
  logout,
  getLoginInfo,
} = require('../auth');
const { updateUserProfile, changePassword } = require('../users');
const { registerAndLogin } = require('./testutil');

beforeEach((done) => {
  registerAndLogin()
    .then(() => {
      done();
    })
    .catch((error) => {
      done(error);
    });
});

it('Can change password', (done) => {
  registerAndLogin()
    .then((userInfo) => {
      changePassword('My New Password')
        .then((changePassStatus) => {
          expect(changePassStatus).toStrictEqual({ success: true });

          // Logout then re-login to prove the password was changed
          logout();
          login(userInfo.username, 'My New Password')
            .then((loginStatus) => {
              expect(loginStatus.success).toBe(true);
              done();
            })
            .catch((error) => {
              done(error);
            });
          done();
        })
        .catch((error) => {
          done(error);
        });
    })
    .catch((error) => {
      done(error);
    });
});

it('Can change first name', (done) => {
  updateUserProfile({ firstName: 'New First Name' })
    .then(() => {
      // Get login info to prove that the change was applied
      getLoginInfo()
        .then((loginInfo) => {
          expect(loginInfo.firstName).toStrictEqual('New First Name');
          done();
        })
        .catch((error) => {
          done(error);
        });
    })
    .catch((error) => {
      done(error);
    });
});

it('Can change last name', (done) => {
  updateUserProfile({ lastName: 'New Last Name' })
    .then(() => {
      // Get login info to prove that the change was applied
      getLoginInfo()
        .then((loginInfo) => {
          expect(loginInfo.lastName).toStrictEqual('New Last Name');
          done();
        })
        .catch((error) => {
          done(error);
        });
    })
    .catch((error) => {
      done(error);
    });
});

it('Can change multiple properties simultaneously', (done) => {
  updateUserProfile({ firstName: 'New First Name', lastName: 'New Last Name' })
    .then(() => {
      // Get login info to prove that the properties were changed
      getLoginInfo()
        .then((loginInfo) => {
          expect(loginInfo.firstName).toStrictEqual('New First Name');
          expect(loginInfo.lastName).toStrictEqual('New Last Name');
          done();
        })
        .catch((error) => {
          done(error);
        });
    })
    .catch((error) => {
      done(error);
    });
});
