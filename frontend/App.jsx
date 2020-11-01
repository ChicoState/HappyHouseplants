import * as React from 'react';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider, Button, IconRegistry, Layout, Text,
} from '@ui-kitten/components';
import { View } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import 'react-native-gesture-handler';
import theme from './components/colorTheme.json';
import HeaderButtons from './components/HeaderButtons';
import CalendarView from './components/Calendar';
import SearchBar from './components/Search';
import Recommend from './components/RecList';
import TipList from './components/TipList';
import PlantProfile from './components/PlantProfile';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import { LoginContext } from './auth';
import AccountProvider from './components/AccountProvider';

const Stack = createStackNavigator();

function AccountButtons(props) {
  const { onRequestLogout } = props;
  return (
    <LoginContext.Consumer>
      {(loginInfo) => {
        if (!loginInfo) {
          return (
            <View>
              <Button>Login</Button>
              <Button>Register</Button>
            </View>
          );
        }

        return (<View><Button onClick={onRequestLogout}>Logout</Button></View>);
      }}
    </LoginContext.Consumer>
  );
}

AccountButtons.propTypes = {
  onRequestLogout: PropTypes.func.isRequired,
};

function LoginScreen(obj) {
  const { navigation } = obj;
  return (
    <LoginView
      onLogin={() => { console.log('Successfully logged in'); }}
    />
  );
}

function RegisterScreen(obj) {
  const { navigation } = obj;
  return (
    <RegisterView
      onRegister={() => { console.log('Successfully registered'); }}
    />
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
      <CalendarView />
    </Layout>
  );
}

function TipScreen() {
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text />
      <TipList />
    </Layout>
  );
}

function RecommendScreen(obj) {
  const { navigation } = obj;
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Recommend onPressItem={(plant) => {
          navigation.navigate('PlantProfile', { plantID: plant.plantID, plantName: plant.plantName });
        }}
        />
      </Layout>
    </>
  );
}

function SearchScreen(obj) {
  /* 2. Get the param */
  const { navigation } = obj;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SearchBar onPressItem={(plant) => {
        navigation.navigate('PlantProfile', { plantID: plant.plantID, plantName: plant.plantName });
      }}
      />
    </Layout>
  );
}

function HomeScreen(obj) {
  const { navigation, route } = obj;
  const { tab } = route.params;
  const tabView = (tab === 'Recommendations') ? RecommendScreen(obj) : TipScreen(obj);

  return (
    <Layout style={{ flex: 1 }}>
      {tabView}
      <Text />
      <Layout>
        <LoginContext.Consumer>
          {(loginInfo) => (<Text>{JSON.stringify(loginInfo)}</Text>)}
        </LoginContext.Consumer>
      </Layout>
      <Button status="primary" onPress={() => { navigation.navigate('My Plants', { otherParam: 'List of all of your plants' }); }}>
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
      <AccountButtons />
    </Layout>
  );
}

const navigationRef = React.createRef();

function App() {
  const [currentTab, setCurrentTab] = React.useState('Recommendations');

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={eva.mapping} theme={{ ...eva.light, ...theme }}>
        <AccountProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ tab: currentTab }}
                options={{
                  headerTitle: () => (
                    <HeaderButtons
                      labels={['Recommendations', 'Tips']}
                      selectedLabel={currentTab}
                      onLabelChanged={(label) => { setCurrentTab(label); navigationRef.current.navigate('Home', { tab: label }); }}
                    />
                  ),
                }}
              />
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
              <Stack.Screen name="Recommend" component={RecommendScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </AccountProvider>
      </ApplicationProvider>
    </>
  );
}

export default App;
