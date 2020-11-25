require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const HOST = '0.0.0.0';
const PORT = '8080';
const { databaseConnection } = require('./database/mongooseConnect.js');
const { insertTestData } = require('./database/mockData/mockDatabase');

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

require('./routes/tips')(app);
require('./routes/savedplants')(app);
require('./routes/myplants')(app);
require('./routes/mycalendar')(app);
require('./routes/plants')(app);
require('./routes/users')(app);

app.listen(PORT, HOST, () => {
  console.log('Listening...');
});
