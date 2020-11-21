import * as React from 'react';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider, Button, IconRegistry, Layout, Text,
} from '@ui-kitten/components';
import { View } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-native-paper';
import PropTypes from 'prop-types';
import 'react-native-gesture-handler';
import Cam from './components/Camera';
import theme from './components/colorTheme.json';
import HeaderButtons from './components/HeaderButtons';
import CalendarView from './components/calendar/Calendar';
import SearchBar from './components/Search';
import Recommend from './components/RecList';
import TipList from './components/TipList';
import PlantProfile from './components/PlantProfile';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import AccountProvider from './components/AccountProvider';
import MyPlantsList from './components/MyPlantsList';

const { LoginContext } = require('./auth');

const Stack = createStackNavigator();

function AccountButtons(props) {
  const { onRequestLogin, onRequestRegister } = props;
  return (
    <LoginContext.Consumer>
      {(loginState) => {
        if (!loginState.loginInfo) {
          return (
            <View>
              <Button onPress={onRequestLogin}>Login</Button>
              <Button onPress={onRequestRegister}>Register</Button>
            </View>
          );
        }

        return (
          <View>
            <Button onPress={() => { loginState.onLogout(); }}>
              Logout
            </Button>
          </View>
        );
      }}
    </LoginContext.Consumer>
  );
}

AccountButtons.propTypes = {
  onRequestLogin: PropTypes.func.isRequired,
  onRequestRegister: PropTypes.func.isRequired,
};

function LoginScreen(obj) {
  const { navigation } = obj;
  return (
    <LoginContext.Consumer>
      {
        (loginState) => (
          <LoginView onLogin={() => { loginState.onLogin(); navigation.navigate('Home'); }} />)
      }
    </LoginContext.Consumer>
  );
}

function RegisterScreen(obj) {
  const { navigation } = obj;
  return (
    <RegisterView
      onRegister={() => { navigation.navigate('Login'); }}
    />
  );
}

function MyPlantsScreen(obj) {
  const { navigation } = obj;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MyPlantsList onPressItem={(plant) => {
        navigation.navigate('PlantProfile', { plantID: plant.plantID, plantName: plant.plantName });
      }}
      />
      <Text />
    </Layout>
  );
}

function CameraScreen() {
  return (<Cam />);
}

function GalleryScreen() {
  return (<SelectImage />);
}

/**
 * Plant Profile Screen
 * @param {*} navContext
 */
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

/**
 * Tip Screen
 */
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

const navigationRef = React.createRef();

function App() {
  const [currentTab, setCurrentTab] = React.useState('Recommendations');

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={eva.mapping} theme={{ ...eva.light, ...theme }}>
        <Provider>
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
                <Stack.Screen name="Camera" component={CameraScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </AccountProvider>
        </Provider>
      </ApplicationProvider>
    </>
  );
}

export default App;
