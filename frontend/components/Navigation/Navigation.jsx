/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { Icon } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from '../Camera/Camera';
import HomeScreen from '../Plants/Home/HomeScreen';
import HeaderButtons from '../Plants/HeaderButtons';
import CalendarScreen from '../Calendar/CalendarScreen';
import SearchScreen from '../Plants/Search/SearchScreen';
import RecommendScreen from '../Plants/Home/RecommendScreen';
import TipScreen from '../Plants/Home/TipScreen';
import MyPlantsScreen from '../Plants/Collection/MyPlantsScreen';
import PlantProfileScreen from '../Plants/PlantProfileScreen';
import LoginScreen from '../Profile/LoginScreen';
import RegisterScreen from '../Profile/RegisterScreen';
import BottomNavi from './BottomNavi';

const navigationRef = React.createRef();
const Stack = createStackNavigator();

const exploreIcon = (props) => (
  <Icon {...props} name="compass-outline" />
);

const searchIcon = (props) => (
  <Icon {...props} name="search-outline" />
);

const calendarIcon = (props) => (
  <Icon {...props} name="calendar-outline" />
);

const collectionIcon = (props) => (
  <Icon {...props} name="grid-outline" />
);

const personIcon = (props) => (
  <Icon {...props} name="person-outline" />
);

function Navigation() {
  const [currentTab, setCurrentTab] = React.useState('Recommendations');

  const screens = [
    {
      name: 'Register',
      component: RegisterScreen,
    },
    {
      name: 'Home',
      isIntialRoute: true,
      component: HomeScreen,
      initialParams: { tab: currentTab },
      options: {
        headerTitle: () => (
          <HeaderButtons
            labels={['Recommendations', 'Tips']}
            selectedLabel={currentTab}
            onLabelChanged={(label) => { setCurrentTab(label); navigationRef.current.navigate('Home', { tab: label }); }}
          />
        ),
      },
      tab: {
        title: 'EXPLORE',
        icon: exploreIcon,
      },
    },
    {
      name: 'PlantProfile',
      component: PlantProfileScreen,
      options: (navContext) => {
        if (navContext.route.params) {
          return ({
            title: navContext.route.params.plantName ?? 'Plant Profile',
          });
        }
        return { title: 'Plant Profile' };
      },
    },
    {
      name: 'Tips',
      component: TipScreen,
    },
    {
      name: 'Recommend',
      component: RecommendScreen,
    },
    {
      name: 'Search',
      component: SearchScreen,
      tab: {
        title: 'SEARCH',
        icon: searchIcon,
      },
    },
    {
      name: 'Calendar',
      component: CalendarScreen,
      tab: {
        title: 'CALENDAR',
        icon: calendarIcon,
      },
    },
    {
      name: 'My Plants',
      component: MyPlantsScreen,
      tab: {
        title: 'COLLECTION',
        icon: collectionIcon,
      },
    },
    {
      name: 'Camera',
      component: CameraScreen,
    },
    {
      name: 'Login',
      component: LoginScreen,
    },
    {
      // TODO: CREATE A PROFILE SCREEN
      name: 'Profile',
      component: RecommendScreen,
      tab: {
        title: 'USER',
        icon: personIcon,
      },
    },
  ];

  const tabScreens = screens.filter((cur) => cur.tab);
  const routeIndexRef = React.useRef();
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(nav) => {
        if (routeIndexRef.current !== nav.index) {
          const routeName = nav.routes[nav.index].name;
          let dstIndex = tabScreens.findIndex((cur) => cur.name === routeName);
          if (dstIndex < 0) {
            dstIndex = undefined;
          }
          setTabIndex(dstIndex);
        }
        routeIndexRef.current = nav.index;
      }}
    >
      <Stack.Navigator
        initialRouteName={screens.find((screen) => screen.isIntialRoute).name}
      >
        {
          screens.map((screen) => (<Stack.Screen {...screen} key={screen.name} />))
        }
      </Stack.Navigator>
      <BottomNavi
        screens={screens}
        onRequestNavigate={(routeName) => navigationRef.current.navigate(routeName)}
        selectedIndex={tabIndex}
      />
    </NavigationContainer>
  );
}

export default Navigation;
