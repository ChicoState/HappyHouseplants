import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomNavigation, BottomNavigationTab, Icon,
} from '@ui-kitten/components';

// import { EvaIconsPack } from '@ui-kitten/eva-icons';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});

function BottomNavi(props) {
  const useBottomNavigationState = (initialState = 0) => {
    const [selectedIndex, setSelectedIndex] = React.useState(initialState);
    return { selectedIndex, onSelect: setSelectedIndex };
  };

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

  const navState = useBottomNavigationState();

  // const BottomTabBar = ({ navigation, state }) => (
  //   <BottomNavigation
  //     style={styles.bottomNavigation}
  //     selectedIndex={state.index}
  //     onSelect={index => navigation.navigate(state.routeNames[index])}
  //   >
  //     <BottomNavigationTab title="EXPLORE" icon={exploreIcon} />
  //     <BottomNavigationTab title="SEARCH" icon={searchIcon} />
  //     <BottomNavigationTab title="CALENDAR" icon={calendarIcon} />
  //     <BottomNavigationTab title="SAVED" icon={collectionIcon} />
  //     <BottomNavigationTab title="USER" icon={personIcon} />
  //   </BottomNavigation>
  // );

  return (
    <>
      <BottomNavigation style={styles.bottomNavigation} {...navState}>
        <BottomNavigationTab title="EXPLORE" icon={exploreIcon} />
        <BottomNavigationTab title="SEARCH" icon={searchIcon} />
        <BottomNavigationTab title="CALENDAR" icon={calendarIcon} />
        <BottomNavigationTab title="SAVED" icon={collectionIcon} />
        <BottomNavigationTab title="USER" icon={personIcon} />
      </BottomNavigation>

    </>
  );
}

export default BottomNavi;
