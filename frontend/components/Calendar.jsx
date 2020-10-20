/* eslint-disable max-classes-per-file */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Calendar } from 'react-native-calendars';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {
  Layout, Text, Button,
} from '@ui-kitten/components';
import UserInput from './GetUserInput';

const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

const datesMarked = {
};

let selectedDate = {};

class Calend extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Calendar
          style={{ borderWidth: 5, borderColor: 'green' }}
          theme={{
            'stylesheet.day.basic': {
              base: {
                width: '50%',
                // height: windowHeight / 9,
                alignItems: 'center',
                // margin: '50%',
              },
            },
            backgroundColor: '#ffffff',
            calendarBackground: '#E8FFDA',
            textSectionTitleColor: 'black',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: 'blue',
            selectedDayTextColor: '#ffffff',
            todayTextColor: 'blue',
            dayTextColor: '#2d4150',
            textDisabledColor: 'grey',
            dotColor: '#00adf5',
            selectedDotColor: 'green',
            arrowColor: 'green',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: 'green',
            indicatorColor: 'blue',
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 20,
            textMonthFontSize: 28,
            textDayHeaderFontSize: 17,
          }}
          // Collection of dates that have to be marked. Default = {}
          markedDates={{
            ...datesMarked,
            ...selectedDate,
          }}
          // Initially visible month. Default = Date()
          current={new Date()}
          // Minimum date that can be selected.
          minDate={firstDayOfYear}
          // Maximum date that can be selected.
          maxDate={lastDayOfYear}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            console.log('selected day', day);
            console.log(day.dateString);
            selectedDate = {};
            if (datesMarked[day.dateString]) {
              delete datesMarked[day.dateString];
            } else {
              selectedDate[day.dateString] = {
                selected: true,
                marked: true,
                selectedColor: 'green',
              };
            }
            console.log(datesMarked);
            this.setState(datesMarked);
          }}
          onDayLongPress={() => {
            console.log('LONG PRESS');
            const { view } = this.props;
            view(true);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat="MMMM yyyy"
          // Handler which gets executed when visible month changes in calendar. 
          // Default = undefined
          onMonthChange={(month) => {
            console.log('month changed', month);
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={false}
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange
          // If firstDay=1 week starts from Monday
          firstDay={0}
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths
          showSixWeeks
        />
      </View>
    );
  }
}

Calend.propTypes = {
  view: PropTypes.func.isRequired,
};

class InputView extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  saveToCalendar() {
    console.log('Saved');
  }

  render() {
    return (
      <Layout style={{ flex: 1 }}>
        <Text>
          Enter Text:
          <UserInput />
          <Button onPress={this.saveToCalendar} />
        </Text>
      </Layout>
    );
  }
}

export default function CalendarView() {
  // const datesMarked = {};
  const [showInputView, setShowInputView] = React.useState(false);
  // const [showSavedNotes, setSavedNotes] = React.useState(datesMarked);
  return (
    showInputView ? <InputView view={setShowInputView} />
      : <Calend view={setShowInputView} />
  );
}
