/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Calendar } from 'react-native-calendars';
import { View } from 'react-native';

const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

const datesMarked = {
};

export default class Calend extends React.Component {
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
            if (datesMarked[day.dateString]) {
              delete datesMarked[day.dateString];
            } else {
              datesMarked[day.dateString] = {
                selected: true,
                marked: true,
                selectedColor: 'green',
              };
            }
            console.log(datesMarked);
            this.setState(datesMarked);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat="MMMM yyyy"
          // Handler which gets executed when visible month changes in calendar. Default = undefined
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
