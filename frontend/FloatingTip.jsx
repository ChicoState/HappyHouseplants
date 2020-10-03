import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Linking,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class FloatingTip extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
    this.handlePress = this.handlePress.bind(this);
    this.styles = StyleSheet.create({
      background: {
        backgroundColor: '#32a852',
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 15,
        elevation: 3,
        marginTop: '2.5%',
        marginBottom: '2.5%',
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
          tipSubject: 'Here\'s a tip',
          tipMessage: 'This tip will be downloaded in the future, right now it\'s a hard-coded string.',
          sourceURL: 'http://www.google.com/',
        });
      }, (error) => {
        console.log(`Failed to load a tip. Reason: ${error}`);
        floatThis.setState({ visible: false });
      });
  }

  handlePress() {
    const { sourceURL } = this.state;
    Linking.openURL(sourceURL);
  }

  render() {
    const { visible, tipSubject, tipMessage } = this.state;
    return (
      visible
      && (
      <TouchableOpacity style={this.styles.background} onPress={this.handlePress}>
        <View>
          <Text style={this.styles.title}>{tipSubject}</Text>
          <Text style={this.styles.message}>{tipMessage}</Text>
        </View>
      </TouchableOpacity>
      )
    );
  }
}

export default FloatingTip;
