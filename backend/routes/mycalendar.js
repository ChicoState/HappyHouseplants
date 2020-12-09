const {
  authGet,
  authPut,
  authPost,
  authDelete,
  updateUserDocument,
} = require('../api/auth');

module.exports = (app) => {
  authGet(app, '/mycalendar/notes', (req, res, userDoc) => {
    let calendarNotes = {};
    if (userDoc.calendarNotes) {
      calendarNotes = userDoc.calendarNotes;
    }

    res.json(calendarNotes);
  }, true);

  authPost(app, '/mycalendar/notes/', (req, res, userDoc) => {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const when = keys[0];
    const note = values[0];

    let calendarNotes = {};
    if (userDoc.calendarNotes) {
      calendarNotes = userDoc.calendarNotes;
    }

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
  }, true);

  authDelete(app, '/mycalendar/notes', (req, res, userDoc) => {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const when = keys[0];
    const noteObj = values[0];

    let calendarNotes = {};
    if (userDoc.calendarNotes) {
      calendarNotes = userDoc.calendarNotes;
    }

    let removed;
    if (calendarNotes[when]) {
      // Remove from the existing date's notes
      const removeIndex = calendarNotes[when].findIndex(
        (cur) => cur.note === noteObj.note && cur.dots === noteObj.dots,
      );
      if (removeIndex > -1) {
        calendarNotes[when].splice(removeIndex, 1);

        if (calendarNotes[when].length === 0) {
          delete calendarNotes[when];
        }

        removed = true;
      } else {
        removed = false;
      }
    } else {
      removed = false;
    }

    if (removed) {
      updateUserDocument(userDoc.userId, { calendarNotes })
        .then(() => {
          res.json(true);
        })
        .catch((error) => {
          console.error(`Failed to remove a calendar note for user ${userDoc.userId} due to an error: ${error}`);
          res.status(500).json({});
        });
    } else {
      res.json(false);
    }
  }, true);

  authGet(app, '/mycalendar/labels/', (req, res, userDoc) => {
    let customLabels = [];
    if (userDoc.customLabels) {
      customLabels = userDoc.customLabels;
    }

    // Remove the unnecessary _id property from labels
    const userReadableLabels = customLabels.map((label) => ({
      text: label.text,
      color: label.color,
    }));

    res.json(userReadableLabels);
  }, true);

  authPut(app, '/mycalendar/labels/', (req, res, userDoc) => {
    const { text, color } = req.body;

    let customLabels = [];
    if (userDoc.customLabels) {
      customLabels = userDoc.customLabels;
    }

    const label = { text, color };
    const existingIndex = customLabels.findIndex((cur) => cur.text === text);
    if (existingIndex !== -1) {
      customLabels[existingIndex] = label;
    } else {
      customLabels.push(label);
    }

    updateUserDocument(userDoc.userId, { customLabels })
      .then(() => {
        res.status(existingIndex === -1 ? 201 : 200).json({});
      })
      .catch((error) => {
        console.error(`Failed to save a calendar label due to an error: ${error}`);
        res.status(500).json({});
      });
  }, true);

  authDelete(app, '/mycalendar/labels', (req, res, userDoc) => {
    const { text } = req.body;

    let customLabels = [];
    if (userDoc.customLabels) {
      customLabels = userDoc.customLabels;
    }

    const removeIndex = customLabels.findIndex((cur) => cur.text === text);
    if (removeIndex > -1) {
      customLabels.splice(removeIndex, 1);
    }

    if (removeIndex !== -1) {
      updateUserDocument(userDoc.userId, { customLabels })
        .then(() => {
          res.json(true);
        })
        .catch((error) => {
          console.error(`Failed to remove a calendar label for user ${userDoc.userId} due to an error: ${error}`);
          res.status(500).json({});
        });
    } else {
      res.json(false);
    }
  }, true);
};
