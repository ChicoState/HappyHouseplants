import * as React from 'react';
import {
  Layout,
} from '@ui-kitten/components';
import MyPlantsList from './MyPlantsList';

function MyPlantsScreen(obj) {
  const { navigation } = obj;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MyPlantsList onPressItem={(plant) => {
        navigation.navigate('PlantProfile', { plantID: plant.plantID, plantName: plant.name });
      }}
      />
    </Layout>
  );
}
export default MyPlantsScreen;
