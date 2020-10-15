const mongoose = require('mongoose');

const connectionURL = `${process.env.CONTAINER_URL}${process.env.DB_NAME}`;

mongoose.connect(connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }).catch((error) => console.log(`Error:${error}`));

mongoose.connection.on('connecting', () => { console.log('Connecting'); });
mongoose.connection.on('connected', () => { console.log('Connected'); });
mongoose.connection.on('disconnecting', () => { console.log('Disconnecting'); });
mongoose.connection.on('disconnected', () => { console.log('Disconnected'); });
mongoose.connection.on('reconnectFailed', () => { console.log('Reconnect failed'); });

module.exports.databaseConnection = mongoose.connection;
