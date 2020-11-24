/* eslint-disable react/jsx-props-no-spreading */
import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomNavigation, BottomNavigationTab,
} from '@ui-kitten/components';

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});

function BottomNavi(screenProps) {
  const { screens, onRequestNavigate, selectedIndex } = screenProps;

  return (
    <>
      <BottomNavigation
        style={styles.bottomNavigation}
        selectedIndex={selectedIndex}
        onSelect={(newIndex) => {
          onRequestNavigate(screens.filter((screen) => screen.tab)[newIndex].name);
        }}
      >
        {
          screens.filter((screen) => (screen.tab)).map((screen) => (
            <BottomNavigationTab {...screen.tab} key={screen.name} />))
        }
      </BottomNavigation>
    </>
  );
}

export default BottomNavi;
