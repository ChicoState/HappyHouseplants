import * as React from 'react';
import {
  Layout,
} from '@ui-kitten/components';
import MyPlantsList from './MyPlantsList';
import FavoritePlantsList from './FavoritePlantsList';
import HeaderButtons from '../HeaderButtons';

function MyPlantsScreen(obj) {
  const { navigation } = obj;
  const [currentTab, setCurrentTab] = React.useState('My Plants');

  const tabView = (currentTab === 'My Plants')
    ? (
      <MyPlantsList onPressItem={(plant) => {
        navigation.navigate('PlantProfile', { plantID: plant.plantID, plantName: plant.name });
      }}
      />
    ) : (
      <FavoritePlantsList onPressItem={(plant) => {
        navigation.navigate('PlantProfile', { plantID: plant.plantID, plantName: plant.name });
      }}
      />
    );

  return (
    <Layout style={{
      flex: 1,
      alignItems: 'center',
      marginTop: 25,
    }}
    >
      <HeaderButtons
        labels={['My Plants', 'Favorites']}
        selectedLabel={currentTab}
        onLabelChanged={(label) => { setCurrentTab(label); }}
      />
      {tabView}
    </Layout>
  );
}
export default MyPlantsScreen;
