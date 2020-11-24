/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider, IconRegistry,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider } from 'react-native-paper';
import 'react-native-gesture-handler';
import theme from './components/Util/colorTheme.json';
import Navigation from './components/Navigation/Navigation';
import AccountProvider from './components/Profile/AccountProvider';

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
