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
    login(username, password, 'token').then((status) => {
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
      <View style={{
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: colorTheme['color-primary-transparent-100'],
        paddingLeft: '1%',
        paddingRight: '1%',
        marginTop: '4%',
      }}
      >
        <Text>{ errorMessage}</Text>
        <Image style={{ width: '100%', height: '10%' }} source={hhptitle} />
        <View style={{ paddingTop: '5%', alignSelf: 'center' }}>
          <Input
            style={{ paddingBottom: '1%', width: '90%' }}
            placeholder="Username"
            value={username}
            onChangeText={(newUsername) => this.setState({ username: newUsername })}
          />
          <Input
            placeholder="Password"
            style={{ paddingBottom: '10%', width: '90%' }}
            value={password}
            onChangeText={(newPass) => this.setState({ password: newPass })}
            secureTextEntry
          />
          <Button onPress={this.startLogin} title="Login"> Login </Button>
        </View>
        <Image style={{ width: '100%', height: '50%' }} source={hhpdark} />
      </View>
    );
  }
}

LoginView.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginView;
