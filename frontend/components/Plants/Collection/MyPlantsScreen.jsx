import * as React from 'react';
import {
  Button, Layout,
} from '@ui-kitten/components';

function MyPlantsScreen(obj) {
  const { navigation } = obj;
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button status="primary" onPress={() => { navigation.navigate('Camera'); }}>
        Go to Camera
      </Button>
    </Layout>
  );
}
export default MyPlantsScreen;
