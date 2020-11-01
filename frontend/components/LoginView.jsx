import { Input } from '@ui-kitten/components';
import React from 'react';
import { Button, View, Text } from 'react-native';
import { login } from '../auth';

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
    login(username, password).then((status) => {
      if (status.success) {
        onLogin();
      } else {
        this.setState({ errorMessage: status.userMessage });
      }
    }).catch((error) => {
      // TODO: Show error dialog
      console.error(`Failed to login due to an error: ${error}`);
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

export default LoginView;
