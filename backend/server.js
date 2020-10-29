require('dotenv').config();
const express = require('express');

const app = express();
const HOST = '0.0.0.0';
const PORT = '8080';
const { databaseConnection } = require('./database/mongooseConnect.js');
const { findDocuments } = require('./database/findDocuments');
const { insertTestData } = require('./database/mockData/mockDatabase');
const { register, login } = require('./auth.js');

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
  const userQuery = { userId: req.params.userId };
  findDocuments('Users', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('User not found');
    } else {
      // Don't send the whole 'user' document, that'll contain sensitive information!
      const user = docs[0];
      const publicUserInfo = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
      res.send(publicUserInfo);
    }
  });
});

app.get('/users/:userId/tips', (req, res) => {
  const userQuery = { userId: req.params.userId };
  findDocuments('Users', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('User not found');
    } else {
      const user = docs[0];
      res.send(user.savedTipsByID);
    }
  });
});

app.get('/users/:userId/plants', (req, res) => {
  const userQuery = { userId: req.params.userId };
  findDocuments('Users', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('User not found');
    } else {
      const user = docs[0];
      res.send(user.savedPlantsByID);
    }
  });
});

app.get('/plants/', (req, res) => {
  const plantsQuery = {};
  findDocuments('Plants', plantsQuery).then((docs) => {
    res.send(docs);
  });
});

app.get('/plants/:plantID', (req, res) => {
  const userQuery = { plantID: req.params.plantID };
  findDocuments('Plants', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('Plant not found');
    } else {
      res.send(docs[0]);
    }
  });
});

app.get('/register/', (req, res) => {//TODO: Remove
  const { username, password } = req.query;
  register(username, password, 'My First Name', 'My Last Name').then((status) => {
    res.json(status);
  }).catch((reason) => {
    res.send(`Failed for reason: ${reason}`);
  });
});

app.get('/login/', (req, res) => {//TODO: Remove
  const { username, password } = req.query;
  login(username, password, 'My First Name', 'My Last Name').then((status) => {
    res.json(status);
  }).catch((reason) => {
    res.send(`Failed for reason: ${reason}`);
  });
});

app.listen(PORT, HOST, () => {
  console.log('Listening...');
});
