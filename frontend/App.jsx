import * as React from 'react';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider, IconRegistry,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import CameraScreen from './components/Camera/Camera';
import theme from './components/colorTheme.json';
import HomeScreen from './components/Plants/Home/HomeScreen';
import HeaderButtons from './components/Plants/HeaderButtons';
import CalendarScreen from './components/Calendar/CalendarScreen';
import SearchScreen from './components/Plants/Search/SearchScreen';
import RecommendScreen from './components/Plants/Home/RecommendScreen';
import TipScreen from './components/Plants/Home/TipScreen';
import MyPlantsScreen from './components/Plants/Collection/MyPlantsScreen';
import PlantProfileScreen from './components/Plants/PlantProfileScreen';
import LoginScreen from './components/Profile/LoginScreen';
import RegisterScreen from './components/Profile/RegisterScreen';
import AccountProvider from './components/Profile/AccountProvider';

const Stack = createStackNavigator();

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
              <Stack.Screen name="Camera" component={CameraScreen} />
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
