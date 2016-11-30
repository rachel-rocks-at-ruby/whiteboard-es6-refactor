const path = require('path');

const http = require('http');
const server = http.createServer();

const express = require('express');
const app = express();

const socketio = require('socket.io')

server.on('request', app);

const io = socketio(server);

const drawHistory = {};
/*

 {
 roomName: [fn]
 }
 */

io.on('connection', socket => {

    let room;

    socket.on('disconnect', () => {
        console.log('im disconnecting')
    });

    socket.on('wantToJoinRoom', roomName => {
        room = roomName;
        socket.join(room);
        if (!drawHistory[room]) drawHistory[room] = [];
        socket.emit('drawHistory', drawHistory[room]);
    });

    socket.on('imDrawing', (start, end, color) => {
        const roomObj = {start, end, color};
        drawHistory[room].push({start: start, end: end, color: color});
        socket.broadcast.to(room).emit('otherDraw', start, end, color)
    });

});

server.listen(1337, () => {
    console.log('The server is listening on port 1337!');
});

app.use(express.static(path.join(__dirname, 'browser')));

app.get('/:roomname', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
