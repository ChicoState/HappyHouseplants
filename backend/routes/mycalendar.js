const {
  authGet,
  authPost,
  updateUserDocument,
} = require('../api/auth');

module.exports = (app) => {
  authGet(app, '/mycalendar/notes', (req, res, userDoc) => {
    let calendarNotes = [];
    if (userDoc.calendarNotes) {
      calendarNotes = userDoc.calendarNotes;
    }

    res.json(calendarNotes);
  }, true);

  authPost(app, '/mycalendar/notes/', (req, res, userDoc) => {
    let calendarNotes = {};
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const when = keys[0];
    const note = values[0];

    if (userDoc.calendarNotes) {
      calendarNotes = userDoc.calendarNotes;

      if (calendarNotes[when]) {
      // Append to the existing date's notes
        calendarNotes[when].push(note);
      } else {
        // Create a new date:note pair
        calendarNotes[when] = [note];
      }

      updateUserDocument(userDoc.userId, { calendarNotes })
        .then(() => {
          res.status(201).json({});
        })
        .catch((error) => {
          console.error(`Failed to save a note due to an error: ${error}`);
          res.status(500).json({});
        });
    }
  }, true);
};
