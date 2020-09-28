import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class FloatingTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      title: "Here's a tip",
      message: 'My tip message, which may contain multiple lines, but is still brief.',
    };
    this.styles = StyleSheet.create({
      background: {
        backgroundColor: '#32a852',
        position: 'absolute',
        width: '80%',
        left: '10%',
        bottom: '5%',
        borderRadius: 15,
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
