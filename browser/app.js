const socket = io(window.location.origin);

socket.on('connect', () => {

    const room = window.location.pathname;

    socket.emit('wantToJoinRoom', room);

    window.whiteboard.on('draw', (start, end, color) => {
        socket.emit('imDrawing', start, end, color)
    });

    socket.on('drawHistory', drawHistory => {
        drawHistory.forEach( draw => {
            whiteboard.draw(draw.start, draw.end, draw.color)
        });
    });

    socket.on('otherDraw', (start, end, color) => {
        window.whiteboard.draw(start, end, color)
    });
});
