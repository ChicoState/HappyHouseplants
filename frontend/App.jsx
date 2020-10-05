import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View, Text } from 'react-native';
import 'react-native-gesture-handler';
import * as React from 'react';
import Calend from './components/Calendar';

const Stack = createStackNavigator();

function HomeScreen(obj) {
  const { navigation } = obj;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to My Plants" onPress={() => { navigation.navigate('My Plants', { otherParam: 'List of all of your plants' }); }} />
      <Text />
      <Button title="Go to Calendar" onPress={() => { navigation.navigate('Calendar'); }} />
      <Text />
      <Button title="Go to Tips" onPress={() => { navigation.navigate('Tips'); }} />
    </View>
  );
}

function MyPlantsScreen(obj) {
  /* 2. Get the param */
  const { route, navigation } = obj;
  const { otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>My Plants</Text>
      <Text />
      <Text>{JSON.stringify(otherParam)}</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Text />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function CalendarScreen(obj) {
  /* 2. Get the param */
  const { navigation } = obj;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Calendar</Text>
      <Text />
      <Calend />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Text />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function TipScreen(obj) {
  /* 2. Get the param */
  const { navigation } = obj;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tips</Text>
      <Text />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Text />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="My Plants" component={MyPlantsScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Tips" component={TipScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
