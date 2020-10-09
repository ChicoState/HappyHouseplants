require('dotenv').config();
const express = require('express');
const { TIPS } = require('./database/models/tips');
const { USERS } = require('./database/models/users');
const app = express();
const HOST = '0.0.0.0';
const PORT = '8080';
const { databaseConnection } = require('./database/mongooseConnect.js');
const { findDocuments } = require('./database/findDocuments');

function main() {
  console.log('Server starting...');
}

/**
 * TODO: we may want to change how often or when we connect to db
 */
databaseConnection.once('open', () => {
  // this is here to serve as an example
  TIPS.insertMany({
    tipSubject: 'Test Sub',
    tipMessage: 'Test msg',
    tipID: 'TestID',
    plantType: 'TestPlant',
    sourceURL: 'testURL',
  });
  main();
});

app.get('/tips/', (req, res) => {
  const tipsQuery = {};
  findDocuments('tips', tipsQuery).then((docs) => {
    res.send(docs);
  });
});

app.get('/tips/:tipID', (req, res) => {
  const tipQuery = { tipID: req.params.tipID };
  findDocuments('tips', tipQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('Tip not found');
    } else {
      res.send(docs[0]);
    }
  });
});

app.get('/users/:userId', (req, res) => {
  res.json({
    firstName: 'Joe',
    lastName: 'Planter',
    username: 'JoeThePlanter',
    userId: req.params.userId,
  });
});

app.get('/users/:userId/tips', (req, res) => {
  res.json(['1', '5', '7']);
});

app.get('/users/:userId/plants', (req, res) => {
  res.json(['1', '2', '3', '4']);
});

app.listen(PORT, HOST, () => {
  console.log('Listening...');
});
