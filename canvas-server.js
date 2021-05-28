const app = require('express')()
    , server = require('http').Server(app)
    , io = require('socket.io')(server)
    , rtsp = require('rtsp-ffmpeg');
;
// use rtsp = require('rtsp-ffmpeg') instead if you have install the package
server.listen(3000, function () {
    console.log('Listening on localhost:3000');
});
var cams = [
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/101'
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/201'
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301'
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/401'
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/501'
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/601'
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/701'
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/801'
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/901'
    , 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/1001'

].map(function (uri, i) {
    var stream = new rtsp.FFMpeg({
        input: uri,
        resolution: '320x240',
        quality: 3,
        arguments: ['-rtsp_transport', 'tcp']
    });
    let url=uri.split("/");
    let channel_number = url[url.length-1];
    stream.on('start', function () {
        console.log('stream ' + channel_number + ' started');
    });
    stream.on('stop', function () {
        console.log('stream ' + channel_number + ' stopped');
    });
    return {stream : stream,channel:channel_number};
});

cams.forEach(function (object, i) {
    var ns = io.of('/' + object.channel);
    ns.on('connection', function (wsocket) {
        console.log('connected to /cam' + object.channel);
        var pipeStream = function (data) {
            wsocket.emit('data', data);
        };
        object.stream.on('data', pipeStream);

        wsocket.on('disconnect', function () {
            console.log('disconnected from /cam' + object.channel);
            object.stream.removeListener('data', pipeStream);
        });
    });
});

io.on('connection', function (socket) {
    socket.emit('start', cams.length);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index-canvas.html');
});
