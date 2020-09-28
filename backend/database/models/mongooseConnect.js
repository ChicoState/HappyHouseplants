const mongoose = require('mongoose');

const connectionURL = `${process.env.CONNECT_URL}${process.env.DB_NAME}`

mongoose.connect(connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).catch(error => console.log(`Error:${error}`));

mongoose.connection.on('connecting', ()=> {});
mongoose.connection.on('connected', ()=> {})
mongoose.connection.on('disconnecting', ()=> {})
mongoose.connection.on('disconnected', ()=> {})
mongoose.connection.on('reconnectFailed', ()=> {})

module.exports.databaseConnection = mongoose.connection;