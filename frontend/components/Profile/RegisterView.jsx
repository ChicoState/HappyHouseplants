import { Input, Button, Text } from '@ui-kitten/components';
import React from 'react';
import PropTypes from 'prop-types';
import { View, Alert, Image } from 'react-native';

const { register } = require('../../api/auth');
const hhpdark = require('../logos/hhpdark.png');
const colorTheme = require('../Util/colorTheme.json');

const marginBottom = { marginBottom: '2%' };

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
        <View style={{
          paddingBottom: '1%',
          width: '90%',
          alignSelf: 'center',
          paddingTop: '2%',
        }}
        >
          <Text />
          <Input
            style={{ paddingBottom: '2%', paddingTop: '10%' }}
            placeholder="Username"
            value={username}
            onChangeText={(newUsername) => this.setState({ username: newUsername })}
          />
          <Input
            style={marginBottom}
            placeholder="First Name"
            value={firstName}
            onChangeText={(newFName) => this.setState({ firstName: newFName })}
          />
          <Input
            style={marginBottom}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(newLName) => this.setState({ lastName: newLName })}
          />
          <Input
            style={marginBottom}
            placeholder="Password"
            value={password}
            onChangeText={(newPass) => this.setState({ password: newPass })}
            secureTextEntry
          />
          <Input
            style={marginBottom}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(newPass) => this.setState({ confirmPassword: newPass })}
            secureTextEntry
          />
        </View>
        <Button onPress={this.startLogin} title="Register">Register</Button>
        <Image style={{ width: '100%', height: '60%' }} source={hhpdark} />
      </View>
    );
  }
}

RegisterView.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default RegisterView;
