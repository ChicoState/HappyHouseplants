import React, { Component } from 'react';
import {
  Layout, Button, Divider, Card,
} from '@ui-kitten/components';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { PropTypes } from 'prop-types';
import { NavigationHelpersContext } from '@react-navigation/native';

const colorTheme = require('../Util/colorTheme.json');
const { updateUserProfile, changePassword } = require('../../api/users');
const { getLoginInfo } = require('../../api/auth');
const { logout } = require('./auth-react');

class UserProfileView extends Component {
  constructor() {
    super();
    this.state = {};
    this.styles = StyleSheet.create({
      container: {
      },
      header: {
        height: '20%',
      },
      headerContent: {
        //backgroundColor: colorTheme['color-primary-transparent-500'],
        backgroundColor: colorTheme['color-success-transparent-200'],
        padding: '10%',
        width: '100%',
        justifyContent: 'center',
      },
      headerCard: {
        backgroundColor: colorTheme['color-primary-transparent-600'],
        justifyContent: 'space-between',
      },
      fullName: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      userName: {
        fontSize: 12,
      },
      body: {
        height: '80%',
      },
      bodyContent: {
        backgroundColor: colorTheme['color-success-transparent-200'],
        paddingBottom: '10%',
        paddingLeft: '10%',
        paddingRight: '10%',
        height: '100%',
        width: '100%',
      },
      account: {
        marginTop: '5%',
        fontSize: 15,
        fontWeight: 'bold',
      },
      editCard: {
        //backgroundColor: colorTheme['color-primary-transparent-500'],
        height: '73%',
        alignContent: 'space-between',
      },
      button: {
        margin: '5%',
      },
      logoutButton: {
        margin: '10%',
      },
    });
  }

  componentDidMount() {
    const userThis = this;
    getLoginInfo()
      .then((userInfo) => {
        userThis.setState({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          userName: userInfo.username,
        });
      }, (error) => {
        console.log(`Failed to user info. Reason: ${error}`);
      });
  }

  render() {
    const { onLogout } = this.props;
    const {
      firstName,
      lastName,
      userName,
    } = this.state;
    return (
      <Layout style={this.styles.container}>

        <Layout style={this.styles.header}>
          <Layout style={this.styles.headerContent}>
            <Card style={this.styles.headerCard}>
              <Text style={this.styles.fullName}>
                {firstName}
                {' '}
                {lastName}
              </Text>
              <Text style={this.styles.userName}>
                {userName}
              </Text>
            </Card>
          </Layout>
        </Layout>

        <Layout style={this.styles.body}>
          <Layout style={this.styles.bodyContent}>
            <Text style={this.styles.account}>
              Account
            </Text>
            <Card style={this.styles.editCard}>
              <Button style={this.styles.button} onPress={() => { logout(); }}>
                Change First Name
              </Button>
              <Button style={this.styles.button} onPress={() => { logout(); }}>
                Change Last Name
              </Button>
              <Button style={this.styles.button} onPress={() => { logout(); }}>
                Change User Name
              </Button>
              <Button style={this.styles.button} onPress={() => { logout(); }}>
                Change Password
              </Button>
            </Card>
            <Button style={this.styles.logoutButton} onPress={() => { logout(); onLogout(); }}>
              Logout
            </Button>
          </Layout>
        </Layout>

      </Layout>
    );
  }
}

UserProfileView.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default UserProfileView;
