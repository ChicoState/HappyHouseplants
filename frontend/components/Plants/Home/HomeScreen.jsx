import * as React from 'react';
import {
  Layout,
} from '@ui-kitten/components';
import 'react-native-gesture-handler';
import RecommendScreen from './RecommendScreen';
import TipScreen from './TipScreen';
import AccountButtons from '../../Profile/AccountButtons';
import SplashScreen from '../../Splash/SplashScreen';
import HeaderButtons from '../HeaderButtons';

const { LoginContext } = require('../../Profile/auth-react');

function HomeScreen(obj) {
  const { navigation, route } = obj;
  let tab;
  if (route.params) {
    tab = route.params.tab;
  } else {
    tab = 'Recommendations';
  }

  const tabView = (tab === 'Recommendations') ? RecommendScreen(obj) : TipScreen(obj);
  const [currentTab, setCurrentTab] = React.useState('Recommendations');

  return (
    <Layout style={{ flex: 1 }}>
      <LoginContext.Consumer>
        {(loginState) => {
          if (!loginState.loginInfo) {
            return (
              <SplashScreen
                navigation={navigation}
              />
            );
          }

          return (
            <Layout style={{ flex: 1 }}>
              <HeaderButtons
                labels={['Recommendations', 'Tips']}
                selectedLabel={currentTab}
                onLabelChanged={(label) => { setCurrentTab(label); navigation.navigate('Home', { tab: label }); }}
              />
              {tabView}
              <AccountButtons
                onRequestLogin={() => { navigation.navigate('Login'); }}
                onRequestRegister={() => { navigation.navigate('Register'); }}
              />
            </Layout>
          );
        }}
      </LoginContext.Consumer>
    </Layout>
  );
}

export default HomeScreen;
