import * as React from 'react';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider, Layout, Text, Button,
} from '@ui-kitten/components';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import Calend from './components/Calendar';
import SeachBar from './components/Search';
import TipList from './components/TipList';
import UserInput from './components/GetUserInput';
import PlantProfile from './components/PlantProfile';

const Stack = createStackNavigator();

function HomeScreen(obj) {
  const { navigation } = obj;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Text />
      <Button status="success" onPress={() => { navigation.navigate('My Plants', { otherParam: 'List of all of your plants' }); }}>
        Go to My Plants
      </Button>
      <Text />
      <Button status="success" onPress={() => { navigation.navigate('Calendar'); }}>
        Go to Calendar
      </Button>
      <Text />
      <Button status="success" onPress={() => { navigation.navigate('Tips'); }}>
        Go to Tips
      </Button>
      <Text />
      <Button status="success" onPress={() => { navigation.navigate('Search'); }}>
        Go to Search
      </Button>
    </Layout>
  );
}

function MyPlantsScreen(obj) {
  const { route } = obj;
  const { otherParam } = route.params;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>My Plants</Text>
      <Text />
      <Text>{JSON.stringify(otherParam)}</Text>
    </Layout>
  );
}

function PlantProfileScreen(navContext) {
  const { route } = navContext;
  const { params } = route;
  return (<PlantProfile plantID={params.plantID} hideTitle={params.plantName !== undefined} />);
}

function CalendarScreen() {
  return (
    <Layout style={{ flex: 1 }}>
      <Calend />
      <UserInput />
      <Text />
      <Text />
      <Text />
      <Text />
      <Text />
      <Text />
      <Text />
      <Text />
      <Text />
      <Text />
      <Text />
      <Text />
    </Layout>
  );
}

function TipScreen() {
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tips</Text>
      <Text />
      <TipList />
    </Layout>
  );
}

function SearchScreen(obj) {
  /* 2. Get the param */
  const { navigation } = obj;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Search</Text>
      <Text />
      <SeachBar />
    </Layout>
  );
}

function App() {
  return (
    <ApplicationProvider mapping={eva.mapping} theme={eva.light}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="My Plants" component={MyPlantsScreen} />
          <Stack.Screen
            name="PlantProfile"
            component={PlantProfileScreen}
            options={(navContext) => ({
              title: navContext.route.params.plantName ?? 'Plant Profile',
            })}
          />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Tips" component={TipScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}

export default App;
