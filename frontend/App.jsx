import * as React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View, TextInput } from 'react-native';
import 'react-native-gesture-handler';

import Calend from './components/Calendar';

const Stack = createStackNavigator();

function HomeScreen(obj) {
  const { navigation } = obj;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Text />
      <Button title="Go to My Plants" onPress={() => { navigation.navigate('My Plants', { otherParam: 'List of all of your plants' }); }} />
      <Text />
      <Button title="Go to Calendar" onPress={() => { navigation.navigate('Calendar'); }} />
      <Text />
      <Button title="Go to Tips" onPress={() => { navigation.navigate('Tips'); }} />
    </Layout>
  );
}

function MyPlantsScreen(obj) {
  const { route, navigation } = obj;
  const { otherParam } = route.params;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>My Plants</Text>
      <Text />
      <Text>{JSON.stringify(otherParam)}</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Text />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </Layout>
  );
}

function CalendarScreen() {
  return (
    <Layout style={{ flex: 1 }}>
      <Calend />
      <Layout style={{ flex: 1 }}>
        <Text />
        <Text />
        <Text> Enter Text:</Text>
        <TextInput />
      </Layout>
    </Layout>
  );
}

function TipScreen(obj) {
  const { navigation } = obj;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tips</Text>
      <Text />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Text />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </Layout>
  );
}

function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="My Plants" component={MyPlantsScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Tips" component={TipScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}

export default App;
