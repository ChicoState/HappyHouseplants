import * as React from 'react';
import 'react-native-gesture-handler';
import RegisterView from './RegisterView';

function RegisterScreen(obj) {
  const { navigation } = obj;
  return (
    <RegisterView
      onRegister={() => { navigation.navigate('Login'); }}
    />
  );
}
export default RegisterScreen;
