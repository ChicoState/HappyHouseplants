/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { View, Alert } from 'react-native';
import { Spinner, Text, Button } from '@ui-kitten/components';
import { PropTypes } from 'prop-types';

const { autoLogin } = require('../Profile/auth-react');

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingLoginInfo: true,
      loginRequired: true,
    };

    this.tryAutoLogin = this.tryAutoLogin.bind(this);
    this.loginRequested = this.loginRequested.bind(this);
    this.registerRequested = this.registerRequested.bind(this);
  }

  componentDidMount() {
    this.tryAutoLogin();
  }

  loginRequested() {
    const { navigation } = this.props;
    navigation.navigate('Login');
  }

  registerRequested() {
    const { navigation } = this.props;
    navigation.navigate('Register');
  }

  tryAutoLogin() {
    autoLogin()
      .then((status) => {
        this.setState({
          loginRequired: !status,
          loadingLoginInfo: false,
        });
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
    if (loginRequired && !loadingLoginInfo) {
      return (
        <View>
          <Text>Welcome, please login or create an account.</Text>
          <Button onPress={this.loginRequested}>Login</Button>
          <Button onPress={this.registerRequested}>Create account</Button>
        </View>
      );
    }

    return (<Spinner />);
  }
}

SplashScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SplashScreen;