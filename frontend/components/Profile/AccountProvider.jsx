import React from 'react';
import PropTypes from 'prop-types';
import * as Notifications from 'expo-notifications';

const { getLoginInfo } = require('../../api/auth');
const { LoginContext } = require('./auth-react');

class AccountProvider extends React.Component {
  constructor() {
    super();
    this.afterLogout = this.afterLogout.bind(this);
    this.afterLogin = this.afterLogin.bind(this);
    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();
    this.state = {
      login: {
        loading: true,
        loginInfo: null,
      },
    };
  }

  componentDidMount() {
    this.afterLogin();
    global.afterLogin = this.afterLogin;
    global.afterLogout = this.afterLogout;
  }

  componentWillUnmount() {
    global.afterLogin = undefined;
    global.afterLogout = undefined;
  }

  afterLogout() {
    this.setState({
      login: {
        loginInfo: null,
        loading: false,
      },
    });
  }

  afterLogin() {
    getLoginInfo().then((li) => {
      this.setState({
        login: {
          loginInfo: li,
          loading: false,
        },
      });
    });
    // This listener is fired whenever a user taps on or interacts with a notification
    // (works when app is foregrounded, backgrounded, or killed)
    this.responseListener.current = Notifications
      .addNotificationResponseReceivedListener((response) => {
        console.log(`response: ${response}`);
      });
    // This listener is fired whenever a notification is received while the app is foregrounded
    this.notificationListener.current = Notifications
      .addNotificationReceivedListener((notifier) => {
        // setNotification(notifier);
        console.log(notifier);
      });
  }

  render() {
    const { login } = this.state;
    const { children } = this.props;
    return (
      <LoginContext.Provider value={login}>
        { children }
      </LoginContext.Provider>
    );
  }
}

AccountProvider.propTypes = {
  children: PropTypes.node,
};

AccountProvider.defaultProps = {
  children: undefined,
};

export default AccountProvider;
