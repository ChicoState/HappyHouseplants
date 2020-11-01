import React from 'react';
import PropTypes from 'prop-types';
import { LoginContext, getLoginInfo } from '../auth';

class AccountProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      loginInfo: undefined,
    };
  }

  componentDidMount() {
    getLoginInfo().then((li) => { this.setState({ loginInfo: li }); });
  }

  render() {
    const { loginInfo } = this.state;
    const { children } = this.props;
    return (
      <LoginContext.Provider value={loginInfo}>
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
