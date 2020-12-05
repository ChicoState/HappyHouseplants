const { SERVER_ADDR } = require('../server');

const { authFetch } = require('./auth');

/**
 * Gets all of the user's calendar notes.
 * @returns { Promise } A Promise that resolves to a dictionary-form object where each key
 * is the date, and each value is an array of notes that have been saved for that date. */
function getCalendarNotes() {
  return authFetch(`${SERVER_ADDR}/mycalendar/notes`);
}

/**
 * Adds a note to the user's calendar.
 * @param { string } when The date on which to put the note.
 * @param { string } text The user-defined text of the note.
 * @param { string } color The color of the dot that will be shown on the calendar.
 * @returns { Promise } A Promise that resolves to nothing when the note has been saved. */
function addCalendarNote(when, text, color) {
  return authFetch(`${SERVER_ADDR}/mycalendar/notes`, 'POST', { [when]: { note: text, dots: color } });
}

/**
 * Removes a note from the user's calendar.
 * @param { string } when The date from which to remove the note.
 * @param { object } noteObj The note object, exactly as it was obtained via `getCalendarNotes()`.
 * @returns { Promise } A Promise that resolves to `true` if the note was found and removed.
 * False indicates that the note was not found, thus nothing changed. */
function removeCalendarNote(when, noteObj) {
  return authFetch(`${SERVER_ADDR}/mycalendar/notes`, 'DELETE', { [when]: noteObj });
}

/**
 * Gets all custom user-defined labels for Calendar events.
 * @returns { Promise } A Promise that resolves to an array of objects, each with
 * a `text` and a `color` property. */
function getCalendarLabels() {
  return authFetch(`${SERVER_ADDR}/mycalendar/labels`, 'GET');
}

/**
 * Adds a custom label for Calendar events.
 * @param { string } text The user-defined label text.
 * @param { string } color The color of the dot on the Calendar GUI that will
 *        represent this label.
 * @returns { Promise } A Promise that resolves when the label was successfully
 * added or updated. */
function addCalendarLabel(text, color) {
  return authFetch(`${SERVER_ADDR}/mycalendar/labels`, 'PUT', { text, color });
}

/**
 * Removes a custom Calendar label.
 * @param { string } text The text of the label to remove.
 * @returns { Promise } A Promise that resolves to `true` if the label was found and
 *          removed. `False` indicates that the label was not found. */
function removeCalendarLabel(text) {
  return authFetch(`${SERVER_ADDR}/mycalendar/labels`, 'DELETE', { text });
}

module.exports = {
  getCalendarNotes,
  addCalendarNote,
  removeCalendarNote,
  getCalendarLabels,
  addCalendarLabel,
  removeCalendarLabel,
};
