import * as React from 'react';
import { Layout } from '@ui-kitten/components';
import SearchBar from './Search';

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
export default SearchScreen;
