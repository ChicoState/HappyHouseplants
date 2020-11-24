import * as React from 'react';
import {
  Layout,
} from '@ui-kitten/components';
import CalendarView from './Calendar';

function CalendarScreen() {
  return (
    <Layout style={{ flex: 1 }}>
      <CalendarView />
    </Layout>
  );
}

export default CalendarScreen;
