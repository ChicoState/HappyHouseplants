import { Input } from '@ui-kitten/components';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, View, Text, Alert,
} from 'react-native';

const { register } = require('../auth');

class RegisterView extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null,
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    };

    this.startLogin = this.startRegister.bind(this);
  }

  startRegister() {
    const {
      username, firstName, lastName, password, confirmPassword,
    } = this.state;
    const { onRegister } = this.props;

    if (confirmPassword === password) {
      register(username, password, firstName, lastName).then((status) => {
        if (status.success) {
          onRegister();
        } else {
          this.setState({ errorMessage: status.userMessage });
        }
      }).catch((error) => {
        Alert.alert(
          'Network Error',
          'Failed to connect to the registration server.',
          [
            { text: 'OK' },
          ],
        );
        console.error(`Failed to register due to an error: ${error}`);
      });
    } else {
      this.setState({ errorMessage: 'The password and confirm password do not match.' });
    }
  }

  render() {
    const {
      username, firstName, lastName, password, confirmPassword, errorMessage,
    } = this.state;
    return (
      <View>
        <Text>{ errorMessage}</Text>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={(newUsername) => this.setState({ username: newUsername })}
        />
        <Input
          placeholder="First Name"
          value={firstName}
          onChangeText={(newFName) => this.setState({ firstName: newFName })}
        />
        <Input
          placeholder="Last Name"
          value={lastName}
          onChangeText={(newLName) => this.setState({ lastName: newLName })}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={(newPass) => this.setState({ password: newPass })}
          secureTextEntry
        />
        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(newPass) => this.setState({ confirmPassword: newPass })}
          secureTextEntry
        />
        <Button onPress={this.startLogin} title="Register" />
      </View>
    );
  }
}

RegisterView.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default RegisterView;
