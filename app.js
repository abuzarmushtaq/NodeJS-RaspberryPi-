console.log('Application running on www.<host>: 8080 port');

var http = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(http);
var Gpio = require('onoff').Gpio;
var LED = new Gpio(4, 'out');


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

    socket.on('light', function (data) {
        lightvalue = data;
        if (lightvalue != LED.readSync()) {
            LED.writeSync(lightvalue);
        }
    });
});

process.on('SIGINT', function () {
    LED.writeSync(0);
    LED.unexport();
    process.exit();
}); 