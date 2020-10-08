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

const tipsQuery = {};
// https://mongoosejs.com/docs/api.html#model_Model.find
app.get('/tips/', (req, res) => {
  // res.json(['0', '1', '2', '3', '4', '5']);
  findDocuments('tips', tipsQuery).then(docs => {
    console.log(docs);
    res.send(docs);
  });
});

app.get('/tips/:tipID', (req, res) => {
  const tip = {
    tipID: req.params.tipID,
    tipSubject: `My tip subject #${req.params.tipID}`,
    tipMessage: 'This is the server-provided sample tip message.',
    sourceURL: 'https://www.google.com/',
    plantType: null,
  };// TODO: Get this from database

  res.json(tip);
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
