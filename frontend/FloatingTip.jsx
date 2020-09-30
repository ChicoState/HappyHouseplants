import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class FloatingTip extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
    this.styles = StyleSheet.create({
      background: {
        backgroundColor: '#32a852',
        width: '80%',
        borderRadius: 15,
        elevation: 3,
      },
      title: {
        fontWeight: 'bold',
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
      },
      message: {
        fontSize: 12,
        padding: 10,
      },
    });
  }

  componentDidMount() {
    const floatThis = this;
    fetch('https://raw.githubusercontent.com/ChicoState/HappyHouseplants/main/package.json')
      .then((response) => response.json())
      .then((data) => {
        floatThis.setState({
          visible: true,
          title: 'Here\'s a tip',
          message: 'This tip will be downloaded in the future, right now it\'s a hard-coded string.',
        });
      }, (error) => {
        console.log(`Failed to load a tip. Reason: ${error}`);
        floatThis.setState({ visible: false });
      });
  }

  render() {
    const { visible, title, message } = this.state;
    return (
      visible
      && (
      <View style={this.styles.background}>
        <Text style={this.styles.title}>{title}</Text>
        <Text style={this.styles.message}>{message}</Text>
      </View>
      )
    );
  }
}

export default FloatingTip;
