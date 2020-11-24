import * as React from 'react';
import {
  Button, Layout, Text,
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
      <Text />
      <Button status="primary" onPress={() => { navigation.navigate('My Plants'); }}>
        Go to My Plants
      </Button>
      <Text />
      <Button status="primary" onPress={() => { navigation.navigate('Calendar'); }}>
        Go to Calendar
      </Button>
      <Text />
      <Button status="primary" onPress={() => { navigation.navigate('Tips'); }}>
        Go to Tips
      </Button>
      <Text />
      <Button status="primary" onPress={() => { navigation.navigate('Recommend'); }}>
        Go to Recommendations
      </Button>
      <Text />
      <Button status="primary" onPress={() => { navigation.navigate('Search'); }}>
        Go to Search
      </Button>
      <AccountButtons
        onRequestLogin={() => { navigation.navigate('Login'); }}
        onRequestRegister={() => { navigation.navigate('Register'); }}
      />
    </Layout>
  );
}

export default HomeScreen;
