import * as React from 'react';
import {
  Layout, Text,
} from '@ui-kitten/components';
import TipList from './TipList';

/**
 * Tip Screen
 */
function TipScreen() {
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text />
      <TipList />
    </Layout>
  );
}

export default TipScreen;
