import { Input } from '@ui-kitten/components';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, View, Text, Alert,
} from 'react-native';

const { registerForPushNotificationsAsync } = require('../../Notifications');
const { login } = require('./auth-react');
const { storeData } = require('../../deviceAccess/saveLocalData');

class LoginView extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      username: '',
      password: '',
    };

    this.startLogin = this.startLogin.bind(this);
  }

  startLogin() {
    const { username, password } = this.state;
    const { onLogin } = this.props;
    registerForPushNotificationsAsync().then((token) => {
      console.log(`storing token: ${token}`);
      storeData('@storage_Key', token);
      login(username, password, token).then((status) => {
        if (status.success) {
          onLogin();
        } else {
          this.setState({ errorMessage: status.userMessage });
        }
      }).catch((error) => {
        Alert.alert(
          'Network Error',
          'Failed to connect to the server.',
          [
            { text: 'OK' },
          ],
        );
        console.error(`Failed to login due to an error: ${error}`);
      });
    });
  }

  render() {
    const { username, password, errorMessage } = this.state;
    return (
      <View>
        <Text>{ errorMessage}</Text>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={(newUsername) => this.setState({ username: newUsername })}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={(newPass) => this.setState({ password: newPass })}
          secureTextEntry
        />
        <Button onPress={this.startLogin} title="Login" />
      </View>
    );
  }
}

LoginView.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginView;
