import * as React from 'react';
import 'react-native-gesture-handler';
import LoginView from './LoginView';

const { LoginContext } = require('../../auth');

function LoginScreen(obj) {
  const { navigation } = obj;
  return (
    <LoginContext.Consumer>
      {
        (loginState) => (
          <LoginView onLogin={() => { loginState.onLogin(); navigation.navigate('Home'); }} />)
      }
    </LoginContext.Consumer>
  );
}

export default LoginScreen;
