import React from 'react';
import * as eva from '@eva-design/eva';
import * as Notifications from 'expo-notifications';
import {
  ApplicationProvider, IconRegistry,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider } from 'react-native-paper';
import 'react-native-gesture-handler';
import theme from './components/Util/colorTheme.json';
import Navigation from './components/Navigation/Navigation';
import AccountProvider from './components/Profile/AccountProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={eva.mapping} theme={{ ...eva.light, ...theme }}>
        <Provider>
          <AccountProvider>
            <Navigation />
          </AccountProvider>
        </Provider>
      </ApplicationProvider>
    </>
  );
}

export default App;
