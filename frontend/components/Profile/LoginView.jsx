import { Input, Button, Text } from '@ui-kitten/components';
import React from 'react';
import PropTypes from 'prop-types';
import { View, Alert, Image } from 'react-native';

const hhpdark = require('../logos/hhpdark.png');
const hhptitle = require('../logos/hhptitle.png');
const colorTheme = require('../Util/colorTheme.json');
const { login } = require('./auth-react');

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
      Alert.alert(
        'Network Error',
        'Failed to connect to the server.',
        [
          { text: 'OK' },
        ],
      );
      console.error(`Failed to login due to an error: ${error}`);
    });
  }

  render() {
    const { username, password, errorMessage } = this.state;
    return (
      <View style={{ width: '80%', alignSelf: 'center', flexDirection: 'column' }}>
        <Text>{ errorMessage}</Text>
        <Image style={{ backgroundColor: colorTheme['color-primary-transparent-100'], width: '100%', height: '10%' }} source={hhptitle} />
        <Image style={{ backgroundColor: colorTheme['color-primary-transparent-100'], width: '100%', height: '60%' }} source={hhpdark} />
        <View style={{ paddingTop: '5%' }}>
          <Input
            style={{ paddingBottom: '1%' }}
            placeholder="Username"
            value={username}
            onChangeText={(newUsername) => this.setState({ username: newUsername })}
          />
          <Input
            placeholder="Password"
            style={{ paddingBottom: '1%' }}
            value={password}
            onChangeText={(newPass) => this.setState({ password: newPass })}
            secureTextEntry
          />
        </View>
        <View style={{ paddingBottom: '5%' }}>
          <Button onPress={this.startLogin} title="Login"> Login </Button>
        </View>
      </View>
    );
  }
}

LoginView.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginView;
