import { HOSTNAME } from '@env';

const PORT = '8080';
const SERVER_ADDR = `http://${HOSTNAME}:${PORT}`;

module.exports = { HOSTNAME, PORT, SERVER_ADDR };
