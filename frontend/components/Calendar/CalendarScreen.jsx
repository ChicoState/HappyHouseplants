import * as React from 'react';
import {
  Layout,
} from '@ui-kitten/components';
import CalendarController from './Calendar';

function CalendarScreen() {
  return (
    <Layout style={{ flex: 1 }}>
      <CalendarController />
    </Layout>
  );
}

export default CalendarScreen;
