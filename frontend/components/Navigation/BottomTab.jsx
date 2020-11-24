import React from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomNavigation, BottomNavigationTab, Icon,
} from '@ui-kitten/components';

import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HeaderButtons from './HeaderButtons';
import CalendarView from './Calendar';
import SearchBar from './Search';
import Recommend from './RecList';
import TipList from './TipList';
import PlantProfile from './PlantProfile';
import BottomNavi from './BottomNavi';

const { Navigator, Screen } = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Navigator>
      <Screen name="Home" component={HomeScreen} />
      <Screen name="My Plants" component={MyPlantsScreen} />
      <Screen
        name="PlantProfile"
        component={PlantProfileScreen}
        options={(navContext) => ({
          title: navContext.route.params.plantName ?? 'Plant Profile',
        })}
      />
      <Screen name="Calendar" component={CalendarScreen} />
      <Screen name="Tips" component={TipScreen} />
      <Screen name="Recommend" component={RecommendScreen} />
      <Screen name="Search" component={SearchScreen} />
    </Navigator>
  );
}
