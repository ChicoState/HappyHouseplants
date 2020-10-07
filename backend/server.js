const express = require('express');

const app = express();

app.get('/tips/', (req, res) => {
  res.json(['0', '1', '2', '3', '4', '5']);
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

app.listen(8080, () => {
  console.log('Listening...');
});
