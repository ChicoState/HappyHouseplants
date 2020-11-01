import React from 'react';
import { Calendar } from 'react-native-calendars';
import { View } from 'react-native';
import {
  Layout, Text, Button, Input, ListItem,
} from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import { SERVER_ADDR } from '../server';
import { authFetch } from '../auth';

const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);

/* Saves a single note to the server.
 * @param { when } The Calendar-formatted string of the date. Example: 2020-10-29 (Oct 29, 2020).
 * @param { text } The text of the note to store.
 * @return { Promise } A Promise that resolves to nothing when the note is successfully saved. */
function saveNote(when, text) {
  return fetch(`${SERVER_ADDR}/mycalendar/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ [when]: text }),
  });
}

/* Gets a dictionary-form object of all notes that are stored
 * on the server for the current user.
 * @return { Promise } A Promise that resolves to a dictionary-form object
 * with all notes for the user. The keys are the Calendar-form dates associated
 * with each note, and the values are string arrays of each note per day.
 * For example:
 * {
 *   '2020-10-28': ['My first ever note on Oct 28, 2020'],
 *   '2020-10-29': ['My note on Oct 29, 2020', 'My second note on this day'],
 * } */
function getNotes() {
  return new Promise((resolve) => {
    authFetch(`${SERVER_ADDR}/mycalendar/notes`)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
}

class CalendarView extends React.Component {
  constructor() {
    super();
    this.state = {
      notes: {},
      selectedDate: null,
      tempNote: '',
      showInputView: false,
    };

    this.updateNotes = () => {
      getNotes().then((downloadedNotes) => { this.setState({ notes: downloadedNotes }); })
        .catch((error) => {
          // TODO: Show error to user, then return home?
          console.error(`Error while fetching calendar notes: ${error}`);
        });
    };
  }

  componentDidMount() {
    this.updateNotes();
  }

  /* Gets a dictionary-form object to pass into the Calendar component, which causes
   * a dot to be rendered on each day with a note, and highlights the current selected
   * day.
   * @return { Object } - A dictionary-form object. Each key is a Calendar-form date, and
   * each value has the following structure { selected: true, marked: true }. The
   * selected property will only be true for the key that is equal to this.state.selectedDate.
   * The marked property will be true for all dates that have at least one note. */
  getCalendarMarkInfo() {
    const { notes, selectedDate } = this.state;
    const dates = Object.keys(notes);
    const notesPerDate = Object.values(notes);
    const ret = {};
    for (let i = 0; i < dates.length; i += 1) {
      const curDate = dates[i];
      const curNotes = notesPerDate[i];
      if (curNotes.length > 0) {
        ret[curDate] = { marked: true };
      }
    }

    if (ret[selectedDate]) {
      ret[selectedDate].selected = true;
    } else {
      ret[selectedDate] = { selected: true };
    }

    return ret;
  }

  render() {
    const {
      notes, tempNote, selectedDate, showInputView,
    } = this.state;

    // For each property in notes (key is date, value is array of notes), create a ListItem
    const noteViews = [];
    const dates = Object.keys(notes);
    const notesPerDate = Object.values(notes);
    for (let i = 0; i < notesPerDate.length; i += 1) {
      const curDate = dates[i];
      const notesOnThisDate = notesPerDate[i];
      const notesStr = notesOnThisDate.join('\n');
      noteViews.push(<ListItem title={curDate} description={notesStr} key={curDate} />);
    }

    if (showInputView) {
      return (
        <Layout style={{ flex: 1 }}>
          <Text>
            Enter Text:
            <Input
              placeholder="Enter note here"
              value={tempNote || ''}
              onChangeText={(newNote) => this.setState({ tempNote: newNote })}
            />
            <Button onPress={() => {
              saveNote(selectedDate, tempNote).then(() => {
                this.setState({ showInputView: false });
                this.updateNotes();
              }).catch((error) => {
                // TODO: Alert to user
                console.error(`Error while trying to save a note: ${error}`);
              });
            }}
            />
          </Text>
        </Layout>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Calendar
          style={{ borderWidth: 5, borderColor: 'green' }}
          theme={{
            'stylesheet.day.basic': {
              base: {
                width: '50%',
                alignItems: 'center',
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
          markedDates={
            this.getCalendarMarkInfo(notes)
          }
          // Initially visible month. Default = Date()
          current={new Date()}
          // Minimum date that can be selected.
          minDate={firstDayOfYear}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            this.setState({ selectedDate: day.dateString });
          }}
          onDayLongPress={(day) => {
            this.setState({ selectedDate: day.dateString, showInputView: true, tempNote: '' });
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
        <ScrollView>
          {noteViews}
        </ScrollView>
      </View>
    );
  }
}

export default CalendarView;
