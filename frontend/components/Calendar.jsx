import React from 'react';
import {Calendar} from 'react-native-calendars';
import {View, Text} from 'react-native';
//import { Calendar, Text } from '@ui-kitten/components';

export default class Calend extends React.Component {
  render() {
    return (
      <View>
        <Calendar
          style={{borderWidth: 10, borderColor: 'brown', height: 600}}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#E8FFDA',
            textSectionTitleColor: 'black',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: 'red',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
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
            '2020-09-25': {
              selected: true,
              marked: true,
              selectedColor: 'green',
            },
            '2020-09-29': {marked: true},
            '2020-09-30': {marked: true, dotColor: 'red', activeOpacity: 0},
            '2020-09-28': {disabled: true, disableTouchEvent: true},
          }}
          // Initially visible month. Default = Date()
          current={'2020-09-23'}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={'2020-01-01'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={'2020-12-30'}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            console.log('selected day', day);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'MMMM yyyy'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(month) => {
            console.log('month changed', month);
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows=false and hideExtraDays=false do not swich month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={true}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths={true}
        />
        <Text>Green = Seed Ready</Text>
      </View>
    );
  }
}