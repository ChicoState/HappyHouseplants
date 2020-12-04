import React, { useState, useEffect, useRef }  from 'react';
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

import { Text, View, Button } from 'react-native';

const { registerForPushNotificationsAsync, sendPushNotification } = require('./Notifications');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function App() {
// Setup Notification handling
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      console.log(`token:${token}`);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notifier) => {
      setNotification(notifier);
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    // (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

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
      {/* <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
      </View> */}
    </>
  );
}

export default App;
