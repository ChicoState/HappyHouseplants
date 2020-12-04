const PORT = '8080';
if (!process || !process.env || !process.env.EXPO_HOSTNAME) {
  process.env.EXPO_HOSTNAME = 'localhost';
}
const SERVER_ADDR = `http://10.0.0.228:${PORT}`;

module.exports = { SERVER_ADDR };
