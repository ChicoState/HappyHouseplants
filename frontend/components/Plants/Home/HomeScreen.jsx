import * as React from 'react';
import {
  Layout, Text,
} from '@ui-kitten/components';
import 'react-native-gesture-handler';
import RecommendScreen from './RecommendScreen';
import TipScreen from './TipScreen';
import AccountButtons from '../../Profile/AccountButtons';

const { LoginContext } = require('../../../auth');

function HomeScreen(obj) {
  const { navigation, route } = obj;
  const { tab } = route.params;
  const tabView = (tab === 'Recommendations') ? RecommendScreen(obj) : TipScreen(obj);

  return (
    <Layout style={{ flex: 1 }}>
      <LoginContext.Consumer>
        {(loginState) => (
          <Text>
            Welcome
            {loginState.loginInfo != null ? ` ${loginState.loginInfo.username}` : ', Please login'}
          </Text>
        )}
      </LoginContext.Consumer>
      {tabView}
      <AccountButtons
        onRequestLogin={() => { navigation.navigate('Login'); }}
        onRequestRegister={() => { navigation.navigate('Register'); }}
      />
    </Layout>
  );
}

export default HomeScreen;
