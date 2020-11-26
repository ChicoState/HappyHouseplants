import React from 'react';
import { Calendar } from 'react-native-calendars';
import {
  View,
  Text,
  Alert,
  Switch,
} from 'react-native';
import {
  Layout, Button, Input, ListItem,
} from '@ui-kitten/components';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

const {
  getCalendarTheme,
  getCalendarThemeDark,
  calendarThemeDark,
  calendarThemeLight,
} = require('./CalendarTheme');

const colorTheme = require('../Util/colorTheme.json');
const {
  getCalendarNotes,
  addCalendarNote,
} = require('../../api/calendar');

const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);

class CalendarView extends React.Component {
  constructor() {
    super();
    this.state = {
      notes: {},
      selectedDate: null,
      tempNote: '',
      showInputView: false,
      toggleTheme: false,
      noteTag: 'water',
      tagColor: 'blue',
      customLabel: '',
      currentMonthView: new Date(),
    };

    this.updateNotes = () => {
      getCalendarNotes().then((downloadedNotes) => { this.setState({ notes: downloadedNotes }); })
        .catch((error) => {
          Alert.alert(
            'Network Error',
            'An error occured while trying to fetch calendar notes',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
          );
          console.error(`Error while fetching calendar notes: ${error}`);
        });
    };
  }

  componentDidMount() {
    this.updateNotes();
  }

  /**
   * Gets a dictionary-form object to pass into the Calendar component, which causes
   * a dot to be rendered on each day with a note, and highlights the current selected
   * day.
   * @return { Object } - A dictionary-form object. Each key is a Calendar-form date, and
   * each value has the following structure { selected: true, marked: true }. The
   * selected property will only be true for the key that is equal to this.state.selectedDate.
   * The marked property will be true for all dates that have at least one note.
   */
  getCalendarMarkInfo() {
    const { notes, selectedDate } = this.state;
    const dates = Object.keys(notes);
    const notesPerDate = Object.values(notes);
    const ret = {};
    for (let i = 0; i < dates.length; i += 1) {
      const curDate = dates[i];
      const curNotes = notesPerDate[i];
      if (curNotes.length > 0) {
        for (let j = 0; j < curNotes.length; j += 1) {
          ret[curDate] = { marked: true, dots: [{ color: curNotes[j].dots }] };
        }
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
      notes, tempNote, selectedDate, showInputView, toggleTheme, customLabel, currentMonthView,
    } = this.state;
    // For each property in notes (key is date, value is array of notes), create a ListItem
    const noteViews = [];
    const dates = Object.keys(notes);
    const notesPerDate = Object.values(notes);
    for (let i = 0; i < notesPerDate.length; i += 1) {
      const curDate = dates[i];
      const notesOnThisDate = notesPerDate[i];
      let notesStr = '';
      for (let j = 0; j < notesOnThisDate.length; j += 1) {
        notesStr += `${notesOnThisDate[j].note}\n`;
      }
      noteViews.push(
        <ListItem
          style={toggleTheme ? getCalendarThemeDark('listItem') : getCalendarTheme('listItem')}
          title={curDate}
          description={notesStr}
          key={curDate}
        />,
      );
    }

    if (showInputView) {
      const { noteTag } = this.state;
      let { tagColor } = this.state;
      let selector = <></>;
      if (noteTag === 'custom') {
        selector = (
          <>
            <Input
              style={{ width: '100%' }}
              placeholder="Custom label name"
              value={customLabel || ''}
              onChangeText={(newLabel) => this.setState({ customLabel: newLabel })}
            />
            <Picker
              selectedValue={tagColor}
              style={{ width: '100%' }}
              onValueChange={(itemValue) => {
                this.setState({ tagColor: itemValue });
              }}
            >
              <Picker.Item label="Green" value="green" />
              <Picker.Item label="Black" value="black" />
              <Picker.Item label="Red" value="red" />
              <Picker.Item label="Yellow" value="yellow" />
              <Picker.Item label="Blue" value="blue" />
            </Picker>
          </>
        );
      } else if (noteTag === 'water') {
        selector = (
          <Picker
            selectedValue={noteTag}
            style={{ width: '100%' }}
            onValueChange={() => {
              this.setState({ tagColor: 'blue' });
            }}
          >
            {// TODO: Loop through all owned plants and give option to add owned plant here
            }
            <Picker.Item label="Jade Plant" value="blue" />
          </Picker>
        );
      } else {
        tagColor = 'brown';
      }
      return (
        <Layout style={{
          flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colorTheme['color-primary-transparent-100'],
        }}
        >
          <Layout style={{
            backgroundColor: colorTheme['color-primary-transparent-100'], justifyContent: 'center', width: '95%', flex: 0.75, padding: '3%',
          }}
          >
            <Text
              style={{
                width: '95%',
                marginTop: '2%',
                marginBottom: '2%',
                paddingTop: '2%',
                paddingBottom: '2%',
                textAlign: 'center',
              }}
            >
              Add trackers for seeding and watering here!
            </Text>
            <Input
              style={{ width: '100%' }}
              placeholder="Enter note here"
              value={tempNote || ''}
              onChangeText={(newNote) => this.setState({ tempNote: newNote })}
            />
            <Picker
              selectedValue={noteTag}
              style={{ width: '100%' }}
              onValueChange={(itemValue) => {
                this.setState({ noteTag: itemValue, tagColor: itemValue });
              }}
            >
              <Picker.Item label="Water Plant" value="water" />
              <Picker.Item label="Plant Seedling" value="seed" />
              { // TODO, ADD custom labels that were created
              // <Picker.Item label={} value={} />
              }
              <Picker.Item label="Add Custom Label" value="custom" />
            </Picker>
            {selector}
            <Text />
            <Button
              style={{
                width: '100%',
              }}
              status="primary"
              onPress={() => {
                if (tempNote !== '') {
                  addCalendarNote(selectedDate, tempNote, tagColor).then(() => {
                    this.setState({ tagColor, showInputView: false });
                    this.updateNotes();
                  }).catch((error) => {
                    Alert.alert(
                      'Internal Error',
                      'An issue occured while trying to save the note',
                      [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                      ],
                    );
                    console.error(`Error while trying to save a note: ${error}`);
                  });
                } else {
                  Alert.alert(
                    'Error',
                    'A blank note can not be saved',
                    [
                      { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                  );
                }
              }}
            >
              Submit
            </Button>
            <Text />
            <Button style={{ width: '100%' }} status="primary" onPress={() => { this.setState({ showInputView: false }); }}>
              Cancel
            </Button>
          </Layout>
        </Layout>
      );
    }
    return (
      <>
        <View style={toggleTheme ? getCalendarThemeDark('toggleWrapper') : getCalendarTheme('toggleWrapper')}>
          <Icon name="moon-o" type="font-awesome" color={toggleTheme ? colorTheme['color-white-background'] : 'green'} />
          <Switch
            trackColor={{ true: colorTheme['color-white-background'], false: colorTheme['color-primary-300'] }}
            thumbColor={toggleTheme ? colorTheme['color-dark-background-400'] : colorTheme['color-primary-600']}
            value={toggleTheme}
            onValueChange={(value) => {
              console.log(`Toggle theme: ${value}`);
              this.setState({ toggleTheme: value });
            }}
          />
        </View>
        <View style={toggleTheme ? getCalendarThemeDark('calendarWrapper1') : getCalendarTheme('calendarWrapper1')}>
          <View style={{ alignContent: 'center' }}>
            <Calendar
              style={toggleTheme ? getCalendarThemeDark('calendar') : getCalendarTheme('calendar')}
              // TODO: currently only the else theme is being rendered on state changes
              // toggleTheme is working correctly
              theme={toggleTheme ? calendarThemeDark : calendarThemeLight}
              markingType="multi-dot"
              markedDates={
                this.getCalendarMarkInfo(notes)
              }
              current={currentMonthView}
              minDate={firstDayOfYear}
              onMonthChange={(month) => {
                this.setState({ currentMonthView: month });
              }}
              onDayPress={(day) => {
                this.setState({ selectedDate: day.dateString });
                Alert.alert(
                  day.dateString,
                  'Save note for this date?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        this.setState({ showInputView: false });
                      },
                    },
                    {
                      text: 'Yes',
                      onPress: () => {
                        this.setState({ showInputView: true });
                      },
                    },
                  ],
                );
              }}
              onDayLongPress={(day) => {
                this.setState({ selectedDate: day.dateString });
                Alert.alert(
                  day.dateString,
                  'Save note for this date?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        this.setState({ showInputView: false });
                      },
                    },
                    {
                      text: 'Yes',
                      onPress: () => {
                        this.setState({ showInputView: true });
                      },
                    },
                  ],
                );
              }}
              monthFormat="MMMM yyyy"
              hideArrows={false}
              hideExtraDays={false}
              disableMonthChange
              firstDay={0}
              enableSwipeMonths
              showSixWeeks
            />
          </View>
          <View style={toggleTheme ? getCalendarThemeDark('noteHeader') : getCalendarTheme('noteHeader')}>
            <Text style={toggleTheme ? getCalendarThemeDark('noteHeaderText') : getCalendarTheme('noteHeaderText')}> Calendar Notes </Text>
          </View>
          <ScrollView
            contentContainerStyle={
                toggleTheme ? getCalendarThemeDark('scrollView') : getCalendarTheme('scrollView')
              }
          >
            {noteViews}
          </ScrollView>
        </View>
      </>
    );
  }
}

export default CalendarView;
