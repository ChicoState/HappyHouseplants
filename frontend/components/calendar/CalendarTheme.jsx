import { StyleSheet } from 'react-native';

const calendarThemeLight = {
  'stylesheet.day.basic': {
    base: {
      width: '50%',
      alignItems: 'center',
    },
  },
  backgroundColor: '#ffffff',
  calendarBackground: 'white',
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
};

const calendarThemeDark = {
  'stylesheet.day.basic': {
    base: {
      width: '50%',
      alignItems: 'center',
    },
  },
  backgroundColor: '#ffffff',
  calendarBackground: 'black',
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
};

const CalendarTheme = StyleSheet.create({
  toggleWrapper: {
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(116, 194, 24, 0.08)',
  },
  calendarWrapper1: {
    flex: 1,
    backgroundColor: 'rgba(116, 194, 24, 0.08)',
  },
  calendar: {
    borderWidth: 5,
    borderColor: '#BFEC70',
    width: '98%',
    alignSelf: 'center',
  },
  listItem: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#EFFBCF',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: '1%',
    color: 'white',
  },
  noteHeader: {
    paddingLeft: '2%',
    paddingTop: '2%',
    backgroundColor: 'rgba(116, 194, 24, 0.08)',
  },
  noteHeaderText: {
    fontFamily: 'monospace',
    color: '#245D04',
  },
  scrollView: {
    paddingTop: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(116, 194, 24, 0.08)',
  },
});

const darkbackground = '#3B3B3B';
const DarkCalendarTheme = StyleSheet.create({
  toggleWrapper: {
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: darkbackground,
  },
  calendarWrapper1: {
    flex: 1,
    backgroundColor: darkbackground,
  },
  calendar: {
    borderWidth: 5,
    borderColor: 'black',
    width: '98%',
    alignSelf: 'center',
  },
  listItem: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'black',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: '1%',
    color: 'white',
  },
  noteHeader: {
    paddingLeft: '2%',
    paddingTop: '2%',
    backgroundColor: darkbackground,
  },
  noteHeaderText: {
    fontFamily: 'monospace',
    color: 'white',
  },
  scrollView: {
    paddingTop: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkbackground,
  },
});

// dark

function getCalendarTheme(element) {
  return CalendarTheme[element];
}

function getCalendarThemeDark(element) {
  return DarkCalendarTheme[element];
}

module.exports = {
  calendarThemeDark,
  calendarThemeLight,
  getCalendarTheme,
  getCalendarThemeDark,
};
