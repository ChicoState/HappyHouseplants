/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { View, Alert, Image } from 'react-native';
import { Spinner, Text, Button } from '@ui-kitten/components';
import { PropTypes } from 'prop-types';

const colorTheme = require('../Util/colorTheme.json');
const { autoLogin } = require('../Profile/auth-react');
const hhp = require('../logos/hhp.png');
const hhptitle = require('../logos/hhptitle.png');

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingLoginInfo: true,
      loginRequired: true,
    };

    this.tryAutoLogin = this.tryAutoLogin.bind(this);
    this.loginRequested = this.loginRequested.bind(this);
    this.registerRequested = this.registerRequested.bind(this);
  }

  componentDidMount() {
    this.tryAutoLogin();
  }

  loginRequested() {
    const { navigation } = this.props;
    navigation.navigate('Login');
  }

  registerRequested() {
    const { navigation } = this.props;
    navigation.navigate('Register');
  }

  tryAutoLogin() {
    autoLogin()
      .then((status) => {
        this.setState({
          loginRequired: !status,
          loadingLoginInfo: false,
        });
      })
      .catch((error) => {
        console.error(`Failed to auto-login due to an error: ${error}`);
        Alert.alert('Login failed', 'Failed to login due to an error.',
          [
            {
              text: 'Retry',
              onPress: () => { this.tryAutoLogin(); },
            },
            {
              text: 'Cancel',
              onPress: () => { this.setState({ loadingLoginInfo: false, loginRequired: true }); },
            },
          ]);
      });
  }

  render() {
    const { loadingLoginInfo, loginRequired } = this.state;
    if (loginRequired && !loadingLoginInfo) {
      return (
<<<<<<< HEAD
<<<<<<< HEAD
        <Layout style={{ flex: 1, alignItems: 'center' }}>
          <Text />
          <Text>Welcome! Please login or create an account.</Text>
          <Image source={require('./fr.png')} />
          <Text />
          <Layout style={{ flexDirection: 'row' }}>
            <Button onPress={this.loginRequested}> Login  </Button>
            <Text> </Text>
            <Button onPress={this.registerRequested}>Register</Button>
          </Layout>
        </Layout>
=======
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{
            flexDirection: 'column',
            backgroundColor: colorTheme['color-primary-500'],
            borderWidth: 5,
            borderColor: colorTheme['color-primary-500'],
            borderBottomColor: colorTheme['color-primary-200'],
            width: '100%',
          }}
          >
            <Text />
            <Text style={{
              textAlign: 'center',
              fontWeight: 'bold',
              paddingBottom: '1%',
              color: 'white',
              fontSize: 20,
            }}
            >
              Welcome
            </Text>
            <Text />
          </View>
          <Text />
          <Image style={{ width: '90%', height: '7%' }} source={hhptitle} />
          <Image style={{ width: '80%', height: '45%', backgroundColor: colorTheme['color-primary-transparent-100'] }} source={hhp} />
          <View style={{
            flex: 1,
            width: '80%',
            flexDirection: 'column-reverse',
            alignContent: 'center',
            paddingBottom: '10%',
            paddingTop: '2%',
          }}
          >
            <Button
              style={{
                borderWidth: 5, borderColor: colorTheme['color-primary-500'], borderBottomColor: colorTheme['color-primary-200'],
              }}
              onPress={this.loginRequested}
            >
              Login
            </Button>
            <Text> </Text>
            <Button style={{ borderWidth: 5, borderBottomColor: colorTheme['color-primary-200'] }} onPress={this.registerRequested}>Register</Button>
          </View>
        </View>
>>>>>>> upstream/main
=======
        <View>
          <Text>Welcome, please login or create an account.</Text>
          <Button onPress={this.loginRequested}>Login</Button>
          <Button onPress={this.registerRequested}>Create account</Button>
        </View>
>>>>>>> 6d1013fb20845618cb1ac80c1a956c749cc9f414
      );
    }

    return (<Spinner />);
  }
}

SplashScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SplashScreen;
