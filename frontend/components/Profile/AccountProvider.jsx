import React from 'react';
import PropTypes from 'prop-types';

const { getLoginInfo } = require('../../api/auth');
const { LoginContext } = require('./auth-react');

class AccountProvider extends React.Component {
  constructor() {
    super();
    this.afterLogout = this.afterLogout.bind(this);
    this.afterLogin = this.afterLogin.bind(this);
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
