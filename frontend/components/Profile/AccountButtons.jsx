import * as React from 'react';
import {
  Button, Layout,
} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import 'react-native-gesture-handler';

const { LoginContext } = require('../../auth');

function AccountButtons(props) {
  const { onRequestLogin, onRequestRegister } = props;
  return (
    <LoginContext.Consumer>
      {(loginState) => {
        if (!loginState.loginInfo) {
          return (
            <Layout>
              <Button onPress={onRequestLogin}>Login</Button>
              <Button onPress={onRequestRegister}>Register</Button>
            </Layout>
          );
        }

        return (
          <Layout>
            <Button onPress={() => { loginState.onLogout(); }}>
              Logout
            </Button>
          </Layout>
        );
      }}
    </LoginContext.Consumer>
  );
}

AccountButtons.propTypes = {
  onRequestLogin: PropTypes.func.isRequired,
  onRequestRegister: PropTypes.func.isRequired,
};
export default AccountButtons;
