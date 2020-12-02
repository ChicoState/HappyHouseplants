/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import {
  StyleSheet, Linking,
} from 'react-native';
import {
  Button, Card, Icon, Layout, Text,
} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { getTip } from '../../../api/tips';

const colorTheme = require('../../Util/colorTheme.json');

class FloatingTip extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
    this.handlePress = this.handlePress.bind(this);
    this.styles = StyleSheet.create({
      background: {
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 15,
        elevation: 3,
        marginTop: '2.5%',
        marginBottom: '2.5%',
      },
      title: {
        backgroundColor: colorTheme['color-primary-transparent-400'],
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
      },
      line: {
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
      },
      message: {
        fontSize: 16,
        paddingTop: 1,
      },
    });
  }

  componentDidMount() {
    const floatThis = this;
    const { tipID } = this.props;
    getTip(tipID)
      .then((data) => {
        floatThis.setState({
          visible: true,
          tipSubject: data.tipSubject,
          tipMessage: data.tipMessage,
          tipID: data.tipID,
          plantType: data.plantType,
          sourceURL: data.sourceURL,
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
    const {
      visible,
      tipID,
      tipSubject,
      tipMessage,
    } = this.state;

    const renderItemHeader = (headerProps, title) => (
      // <Layout {...headerProps}>
      <Layout style={this.styles.line}>
        {/* <Text category="h5" style={this.styles.title}> */}
        <Text category="h5" style={this.styles.title}>
          {title}
        </Text>
      </Layout>
    );

    return (
      visible
      && (
        <Layout>
          <Card
            key={tipID}
            style={this.styles.background}
            status="success"
            header={(headerProps) => renderItemHeader(headerProps, tipSubject)}
            onPress={this.handlePress}
          >
            <Text style={this.styles.message}>{tipMessage}</Text>
          </Card>
        </Layout>
      )
    );
  }
}

FloatingTip.propTypes = {
  tipID: PropTypes.string.isRequired,
};

export default FloatingTip;
