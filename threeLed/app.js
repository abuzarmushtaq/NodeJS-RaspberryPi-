console.log('Application running on www.<host>: 8080 port');

var http = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(http);
var Gpio = require('onoff').Gpio;

var switch1 = new Gpio(4, 'out');
var switch2 = new Gpio(11, 'out');
var switch3 = new Gpio(26, 'out');


http.listen(8080); //listen to port 8080

function handler(req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}

io.sockets.on('connection', function (socket) {
    var lightvalue = 0;

    // light 1
    socket.on('light1', function (data) {
        lightvalue = data;
        if (lightvalue != switch1.readSync()) {
            switch1.writeSync(lightvalue);
        }
    });

    // light 2
    socket.on('light2', function (data) {
        lightvalue = data;
        if (lightvalue != switch2.readSync()) {
            switch2.writeSync(lightvalue);
        }
    });

    // light 3
    socket.on('light3', function (data) {
        lightvalue = data;
        if (lightvalue != switch3.readSync()) {
            switch3.writeSync(lightvalue);
        }
    });
});

process.on('SIGINT', function () {

    switch1.writeSync(0);
    switch1.unexport();

    switch2.writeSync(0);
    switch2.unexport();

    switch3.writeSync(0);
    switch3.unexport();
    
    process.exit();
}); 