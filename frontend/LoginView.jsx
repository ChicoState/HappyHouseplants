import { Input } from '@ui-kitten/components';
import React from 'react';
import { Button, View, Text } from 'react-native';

class LoginView extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      username: '',
      password: '',
    };
  }

  render() {
    const { username, password, errorMessage } = this.state;
    return (
      <View>
        (errorMessage ??
        <Text>{ errorMessage}</Text>
        )
        <Input
          placeholder="Username"
          value={username}
          onChangeText={(newUsername) => this.setState({ username: newUsername })}
        />
        <Input
          value={password}
          onChangeText={(newPass) => this.setState({ password: newPass })}
          secureTextEntry
        />
        <Button onPress={startLogin}>
          Login
        </Button>
      </View>
    );
  }
}

export default LoginView;
