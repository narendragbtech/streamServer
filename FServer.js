const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const rtsp = require('rtsp-ffmpeg');
const fs = require('fs');

server.listen(3000,function () {
    console.log("Server Start at 3000 port");
});
let uri = 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301';
let stream = new rtsp.FFMpeg({input: uri,resolution: '320x240', quality: 3, rate: 10,
    arguments:['-rtsp_transport', 'tcp']});
stream.on('start', function() {
    console.log('stream  started');
});
stream.on('stop', function() {
    console.log('stream  stopped');
});
function saveImage(filename, data){

    fs.writeFile(path.resolve('frames', filename), data, function(err) {
        if(err) {
            console.error(err);
        } else {
            console.log("The file was saved!");
        }
    });
}
io.on('connection', function (socket) {
    let pipeStream = function (data) {
        socket.emit('data', data);
    };
    stream.on('data', pipeStream);
    socket.on('disconnect', function () {
        console.log("disconnect");
        stream.removeListener('data', pipeStream);
    });
    console.log("socket connected");
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/home.html');
});



// ffmpeg -f dshow -i video="Lenovo EasyCamera" -vcodec mpeg4 -tune zerolatency -preset ultrafast -f mpegts rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301
// ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301 -map 0:0 -y -update 1 -q 31 -frames 1 -f image2 camera.jpg
// ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301 -map 0:0 -y -updatefirst 1 -q 0 -frames 1 -f image2 camera.jpg
// ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301 -map 0:0 -y -updatefirst 1 -q 0 -frames 1 -f image2 camera.jpg
// ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301 -f image2 -vf fps=fps=1/120 camera.jpg
// ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301 -vcodec copy -acodec copy -map 0 -f segment -segment_time 300 -segment_format mp4 "ffmpeg_capture-%03d.mp4"
// // ffmpeg -rtsp_transport tcp  -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301 -preset ultrafast -vcodec libx264 -tune zerolatency -b:v 900k -f mpegts http://localhost:3000/ffmpeg_captured.mp4
// ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301 -c copy -hls_time 2 -hls_wrap 10 /video/streaming.m3u8
