import { Button, View, Text } from 'react-native';
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Calend from './components/Calendar';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title='Go to Library' onPress={() => { navigation.navigate('Library', { otherParam: 'List of all of your plants' }); }} />
      <Text> </Text>
      <Button title='Go to Calendar' onPress={() => { navigation.navigate('Calendar', { otherParam: 'Calendar for tracking seed growth' }); }} />
    </View>
  );
}

function LibraryScreen({ route, navigation }) {
  /* 2. Get the param */
  const { itemId } = route.params;
  const { otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Library Screen</Text>
      <Text>{JSON.stringify(otherParam)}</Text>
      <Button title='Go to Home' onPress={() => navigation.navigate('Home')} />
      <Text></Text>
      <Button title='Go back' onPress={() => navigation.goBack()} />
    </View>
  );
}

function CalendarScreen({ route, navigation }) {
  /* 2. Get the param */
  const { itemId } = route.params; 
  const { otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Calendar Screen</Text>
      <Text>{JSON.stringify(otherParam)}</Text>
      <Calend></Calend>
      <Button title='Go to Home' onPress={() => navigation.navigate('Home')} />
      <Text></Text>
      <Button title='Go back' onPress={() => navigation.goBack()} />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Library' component={LibraryScreen} />
        <Stack.Screen name='Calendar' component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


