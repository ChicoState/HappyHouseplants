import * as React from 'react';
import 'react-native-gesture-handler';
import LoginView from './LoginView';

function LoginScreen(obj) {
  const { navigation } = obj;
  return (<LoginView onLogin={() => { navigation.navigate('Home'); }} />);
}

export default LoginScreen;
