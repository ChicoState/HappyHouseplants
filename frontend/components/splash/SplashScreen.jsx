import React from 'react';
import { View, Alert } from 'react-native';
import { Spinner, Text, Button } from '@ui-kitten/components';
import { PropTypes } from 'prop-types';

const { autoLogin } = require('../auth/auth-react');

class SplashScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      loadingLoginInfo: true,
      loginRequired: true,
    };
  }

  componentDidMount() {
    this.tryAutoLogin();
  }

  tryAutoLogin() {
    const { onLoginCompleted } = this.props;
    autoLogin()
      .then((status) => {
        this.setState({
          loginRequired: !status,
          loadingLoginInfo: false,
        });

        if (status) {
          onLoginCompleted();
        }
      })
      .catch((error) => {
        console.error(`Failed to auto-login due to an error: ${error}`);
        Alert.alert('Login failed', 'Failed to login due to an error.',
          [
            {
              text: 'Retry',
              onPress: () => { this.tryAutoLogin.tryAutoLogin(); },
            },
            {
              text: 'Cancel',
              onPress: () => { this.setState({ loadingLoginInfo: false, loginRequired: true }); },
            },
          ]);
      });
  }

  render() {
    const { loadingLoginInfo, loginRequired } = this.state;
    const { onLoginRequested, onRegisterRequested } = this.props;
    if (loginRequired && !loadingLoginInfo) {
      return (
        <View>
          <Text>Welcome, please login or create an account.</Text>
          <Button onPress={onLoginRequested}>Login</Button>
          <Button onPress={onRegisterRequested}>Create account</Button>
        </View>
      );
    }

    return (<Spinner />);
  }
}

SplashScreen.propTypes = {
  onLoginRequested: PropTypes.func.isRequired,
  onRegisterRequested: PropTypes.func.isRequired,
  onLoginCompleted: PropTypes.func.isRequired,
};

export default SplashScreen;
