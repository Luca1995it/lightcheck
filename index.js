var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const speed = 100;

app.get('/', function(req, res){
    console.log("Sending bundle react " + __dirname);
    res.sendFile(__dirname + '/client/build/index.html');
});

http.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});

var positions = require('./positions.json');

io.on('connection', (socket) => {
    socket.emit('update', positions);

    socket.on('repaired', (index) => {
        if(index >= 0 && index < positions.lamps.length){
            positions.lamps[index].working = True;
            socket.emit('update', positions);
        }
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected")
    });

    const breakLamp = () => {
        var rand = Math.floor(Math.random() * positions.lamps.length);
        positions.lamps[rand].working = false;
        socket.emit('update', positions);
        setTimeout(breakLamp, Math.floor(Math.random() * speed * 1000 + 10000));
    }

    breakLamp();
});