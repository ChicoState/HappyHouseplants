import React from 'react';
import PropTypes from 'prop-types';
import { loginContext } from '../auth';

class AccountConsumer extends React.Component {
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
      <loginContext.Provider value={loginInfo}>
        { children }
      </loginContext.Provider>
    );
  }
}

AccountConsumer.propTypes = {
  children: PropTypes.node,
};

AccountConsumer.defaultProps = {
  children: undefined,
};

export default AccountConsumer;
