require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const HOST = '0.0.0.0';
const PORT = '8080';
const { databaseConnection } = require('./database/mongooseConnect.js');
const { findDocuments, findOneDocument } = require('./database/findDocuments');
const { insertTestData } = require('./database/mockData/mockDatabase');
const { authenticateUserRequest } = require('./api/auth.js');

function main() {
  console.log('Server starting...');
}

/**
 * TODO: we may want to change how often or when we connect to db
 */
databaseConnection.once('open', () => {
  main();
  insertTestData();
});

app.use(bodyParser.json({
  limit: '100mb', // Allow 100mb for image POSTs
})); // Needed so we can read the body of POSTs

app.get('/random_tips/', (req, res) => {
  const maxCount = req.query.count ? req.query.count : 10;
  const tipsQuery = {};
  findDocuments('tips', tipsQuery).then((docs) => {
    const shuffledDocs = docs;
    // Shuffle the documents
    for (let i = shuffledDocs.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const hold = docs[i];
      shuffledDocs[i] = docs[j];
      shuffledDocs[j] = hold;
    }
    const endIndex = Math.min(maxCount, shuffledDocs.length);
    res.json(shuffledDocs.slice(0, endIndex).map((tip) => tip.tipID));
  });
});

app.get('/tips/', (req, res) => {
  const tipsQuery = {};
  findDocuments('tips', tipsQuery).then((docs) => {
    res.json(docs);
  });
});

app.get('/tips/:tipID', (req, res) => {
  const tipQuery = { tipID: req.params.tipID };
  findDocuments('tips', tipQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).json({});
    } else {
      res.json(docs[0]);
    }
  });
});

app.get('/mytips', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      findOneDocument('Users', { userId }).then((user) => {
        res.json(user.savedTipsByID);
      });
    } else {
      res.status(403).json({});
    }
  });
});

require('./routes/savedplants')(app);
require('./routes/myplants')(app);
require('./routes/mycalendar')(app);
require('./routes/plants')(app);
require('./routes/users')(app);

app.listen(PORT, HOST, () => {
  console.log('Listening...');
});
