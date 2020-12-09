import React, { Component } from 'react';
import {
  Button,
  Card,
  Input,
  Modal,
  Text,
} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
} from 'react-native';

import { PropTypes } from 'prop-types';

const colorTheme = require('./colorTheme.json');

class Prompt extends Component {
  constructor() {
    super();
    this.state = {
      password: '',
      confirmPassword: '',
    };
    this.styles = StyleSheet.create({
      backdropStyle: {
        backgroundColor: colorTheme['color-success-transparent-600'],
      },
      promptCard: {

      },
      message: {

      },
      errorMessage: {

      },
      input: {

      },
    });
  }

  render() {
    const {
      errorMessage,
      isPassword,
      isVisible,
      message,
      onCancel,
      onConfirm,
      placeholder,
      title,
    } = this.props;
    const { password, confirmPassword, value } = this.state;
    const inputView = isPassword ? (
      <View>
        <Text>
          Password
        </Text>
        <Input
          placeholder="Password"
          value={password}
          onChangeText={(newPass) => this.setState({ password: newPass })}
          secureTextEntry
        />
        <Text />
        <Text>
          Confirm Password
        </Text>
        <Input
          placeholder="Password"
          value={confirmPassword}
          onChangeText={(newPass) => this.setState({ confirmPassword: newPass })}
          secureTextEntry
        />
      </View>
    ) : (
      <View>
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={(input) => this.setState({ value: input })}
        />
      </View>
    );

    const renderTitleHeader = () => (
      <View >
        <Text category="h3">
          {title}
        </Text>
      </View>
    );

    const renderConfirmFooter = () => (
      <View>
        <Button
          onPress={() => onConfirm(value)}
        >
          OK
        </Button>
        <Button
          onPress={() => onCancel(value)}
        >
          Cancel
        </Button>
      </View>
    );

    return (

      <Modal
        visible={isVisible}
        backdropStyle={this.styles.backdropStyles}
        onBackdropPress={() => onCancel()}
      >
        <Card
          disabled
          style={this.styles.promptCard}
          header={() => renderTitleHeader()}
          footer={() => renderConfirmFooter()}
          status="primary"
        >
          <Text style={this.styles.message}>
            {message}
          </Text>
          <Text style={this.styles.errorMessage}>
            {errorMessage}
          </Text>
          { inputView }
        </Card>
      </Modal>
    );
  }
}

Prompt.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  isPassword: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
export default Prompt;
