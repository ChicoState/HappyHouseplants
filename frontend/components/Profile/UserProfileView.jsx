/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import {
  Button, Card, Layout,
} from '@ui-kitten/components';
import {
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import Prompt from 'react-native-input-prompt';
import { PropTypes } from 'prop-types';

const colorTheme = require('../Util/colorTheme.json');
const { updateUserProfile, changePassword } = require('../../api/users');
const { getLoginInfo } = require('../../api/auth');
const { logout } = require('./auth-react');

class UserProfileView extends Component {
  constructor() {
    super();
    this.state = {
      changingUser: false,
      changingFirst: false,
      changingLast: false,
      changingPass: false,
    };
    this.styles = StyleSheet.create({
      container: {
      },
      header: {
        height: '20%',
      },
      headerContent: {
        backgroundColor: colorTheme['color-success-transparent-200'],
        padding: '10%',
        width: '100%',
        justifyContent: 'center',
      },
      headerCard: {
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
      changingUser,
      changingFirst,
      changingLast,
      changingPass,
    } = this.state;
    // const changeUsernameDialog = ();
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

              <Prompt
                visible={changingFirst}
                title="Change Firstname"
                placeholder="New First Name"
                onCancel={() => this.setState({ changingFirst: false })}
                onSubmit={(input) => {
                  updateUserProfile({ firstName: input })
                    .then(() => {
                      this.setState({ firstName: input, changingFirst: false });
                    })
                    .catch((error) => {
                      console.error(`Failed to update first name due to an error: ${error}`);
                      Alert.alert('Sorry, Failed to update first name.');
                    });
                }}
              />
              <Button
                style={this.styles.button}
                onPress={() => { this.setState({ changingFirst: true }); }}
              >
                Change First Name
              </Button>

              <Prompt
                visible={changingLast}
                title="Change Lastname"
                placeholder="New Last Name"
                onCancel={() => this.setState({ changingLast: false })}
                onSubmit={(input) => {
                  updateUserProfile({ lastName: input })
                    .then(() => {
                      this.setState({ lastName: input, changingLast: false });
                    })
                    .catch((error) => {
                      console.error(`Failed to update last name due to an error: ${error}`);
                      Alert.alert('Sorry, Failed to update last name.');
                    });
                }}
              />
              <Button
                style={this.styles.button}
                onPress={() => { this.setState({ changingLast: true }); }}
              >
                Change Last Name
              </Button>

              <Prompt
                visible={changingUser}
                title="Change Username"
                placeholder="New Username"
                onCancel={() => this.setState({ changingUser: false })}
                onSubmit={(input) => {
                  updateUserProfile({ username: input })
                    .then(() => {
                      this.setState({ userName: input, changingUser: false });
                    })
                    .catch((error) => {
                      console.error(`Failed to update username due to an error: ${error}`);
                      Alert.alert('Sorry, Failed to update username.');
                    });
                }}
              />
              <Button
                style={this.styles.button}
                onPress={() => { this.setState({ changingUser: true }); }}
              >
                Change Username
              </Button>

              <Prompt
                visible={changingPass}
                title="Change Password"
                placeholder="New Password"
                onCancel={() => this.setState({ changingPass: false })}
                onSubmit={(input) => {
                  changePassword(input)
                    .then((state) => {
                      if (state.success) {
                        this.setState({ changingPass: false });
                      } else {
                        console.error(`Failed to update password due to : ${state.userMessage}`);
                        Alert.alert(`Sorry, Failed to update password.\n ${state.userMessage}`);
                      }
                    })
                    .catch((error) => {
                      console.error(`Failed to update password due to an error: ${error}`);
                      Alert.alert('Sorry, Failed to update password.');
                    });
                }}
              />
              <Button
                style={this.styles.button}
                onPress={() => { this.setState({ changingPass: true }); }}
              >
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
