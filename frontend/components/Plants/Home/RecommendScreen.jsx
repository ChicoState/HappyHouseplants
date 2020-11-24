import * as React from 'react';
import {
  IconRegistry, Layout,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import Recommend from './RecList';

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
export default RecommendScreen;
