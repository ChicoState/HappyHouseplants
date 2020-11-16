import { StyleSheet } from 'react-native';

const colorTheme = require('../colorTheme.json');

const calendarThemeLight = {
  'stylesheet.day.basic': {
    base: {
      width: '50%',
      alignItems: 'center',
    },
  },
  backgroundColor: colorTheme['color-white-background'],
  calendarBackground: colorTheme['color-white-background'],
  textSectionTitleColor: colorTheme['color-dark-background-100'],
  textSectionTitleDisabledColor: colorTheme['color-calendar-day-text'],
  selectedDayBackgroundColor: 'green',
  selectedDayTextColor: colorTheme['color-white-background'],
  todayTextColor: colorTheme['color-primary-700'],
  dayTextColor: '#2d4150',
  textDisabledColor: 'grey',
  dotColor: '#00adf5',
  selectedDotColor: colorTheme['color-primary-700'],
  arrowColor: colorTheme['color-primary-700'],
  disabledArrowColor: '#d9e1e8',
  monthTextColor: colorTheme['color-primary-700'],
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
  backgroundColor: colorTheme['color-white-background'],
  calendarBackground: colorTheme['color-white-background'],
  textSectionTitleColor: colorTheme['color-dark-background-100'],
  textSectionTitleDisabledColor: colorTheme['color-calendar-day-text'],
  selectedDayBackgroundColor: 'green',
  selectedDayTextColor: colorTheme['color-white-background'],
  todayTextColor: colorTheme['color-primary-700'],
  dayTextColor: '#2d4150',
  textDisabledColor: 'grey',
  dotColor: '#00adf5',
  selectedDotColor: colorTheme['color-primary-700'],
  arrowColor: colorTheme['color-primary-700'],
  disabledArrowColor: '#d9e1e8',
  monthTextColor: colorTheme['color-primary-700'],
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
    backgroundColor: colorTheme['color-primary-transparent-100'],
  },
  calendarWrapper1: {
    flex: 1,
    backgroundColor: colorTheme['color-primary-transparent-100'],
  },
  calendar: {
    borderWidth: 2,
    borderColor: '#BFEC70',
    width: '98%',
    alignSelf: 'center',
  },
  listItem: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorTheme['color-white-background'],
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colorTheme['color-primary-100'],
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: '1%',
    color: colorTheme['color-white-background'],
  },
  noteHeader: {
    paddingLeft: '2%',
    paddingTop: '2%',
    backgroundColor: colorTheme['color-primary-transparent-100'],
  },
  noteHeaderText: {
    fontFamily: 'monospace',
    color: '#245D04',
  },
  scrollView: {
    paddingTop: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorTheme['color-primary-transparent-100'],
  },
});

const DarkCalendarTheme = StyleSheet.create({
  toggleWrapper: {
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colorTheme['color-dark-background-600'],
  },
  calendarWrapper1: {
    flex: 1,
    backgroundColor: colorTheme['color-dark-background-600'],
  },
  calendar: {
    borderWidth: 5,
    borderColor: colorTheme['color-dark-background-900'],
    width: '98%',
    alignSelf: 'center',
  },
  listItem: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorTheme['color-dark-background-100'],
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colorTheme['color-dark-background-100'],
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: '1%',
    color: colorTheme['color-white-background'],
  },
  noteHeader: {
    paddingLeft: '2%',
    paddingTop: '2%',
    backgroundColor: colorTheme['color-dark-background-600'],
  },
  noteHeaderText: {
    fontFamily: 'monospace',
    color: colorTheme['color-white-background'],
  },
  scrollView: {
    paddingTop: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorTheme['color-dark-background-600'],
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
