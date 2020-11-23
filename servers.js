//create express server that listens on port 8080

const express = require('express');
const app = express();
app.use(express.static(__dirname+'/public'));

const expressServer = app.listen(8080);

const socketio = require('socket.io');
const io = socketio(expressServer);

console.log('Express server and socketio listening for requests on port 8080');

const helmet = require('helmet');
app.use(helmet());

module.exports = {
    app,io
}