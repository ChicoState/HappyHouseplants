require('dotenv').config();
const { databaseConnection } = require('./database/models/mongooseConnect.js');

function main() {
  console.log('Server starting...');
}

databaseConnection.once('open', () => {
  main();
});
