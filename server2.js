const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const rtsp = require('rtsp-ffmpeg');
const path = require('path');
const fs = require('fs');
const {spawn} = require("child_process");

app.use(express.static(path.join("public")));

let filenames = [];
readCameras().then(canvasList => {
    let streamList = canvasList.map(function (uri, i) {
        let stream = new rtsp.FFMpeg({
            input: uri.url,
            resolution: '704*576',
            quality: 12,
            arguments: ['-rtsp_transport', 'tcp']
        });

        let channel_number = uri.image;
        stream.on('start', function () {
            console.log('stream ' + channel_number + ' started');
        });
        stream.on('stop', function () {
            console.log('stream ' + channel_number + ' stopped');
        });
        return {stream: stream, channel: channel_number};
    });

    streamList.forEach(function (object, i) {
        let ns = io.of('/' + object.channel);
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
}).catch(error=>{
    console.log(error)
});

io.on('connection', function (socket) {
    socket.emit('capture', filenames);
});

app.get('/', async function (req, res) {
    let AllChildProcess = await captureStreamImages();
    Promise.all(AllChildProcess).then(r => {
        console.log(r);
        res.sendFile(__dirname + '/index-canvas.html');
    }).catch(error => {
        console.log(error);
    });

});

async function captureStreamImages() {
    let cameras = await readCameras();
    filenames = [];
    if (!cameras) {
        console.log("camera list not available");
        return null;
    }
    return cameras.map(cam => {
        return new Promise((resolve, reject) => {
            let filename = `./public/images/picture_${cam.image}.jpg`;
            let ls = spawn("ffmpeg",
                ["-rtsp_transport", "tcp", "-i", cam.url, "-vframes","10" , "-q:v", "5","-f","image2" ,"-update", "1", "-y", filename]);
            ls.on("close", code => {
                console.log(`child process exited with code ${code}`);
                filenames.push({image:`images/picture_${cam.image}.jpg`,code:"/"+cam.image});
                resolve(1);
            });
            ls.on('error', function (err) {
                if (err.code === 'ENOENT') {
                    reject(new Error('FFMpeg executable wasn\'t found. Install this package and check FFMpeg.cmd property'));
                } else {
                    reject(err);
                }
            });
        });
    });
}
// ffmpeg -ss 0.5 -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/401 -vframes 1 -f image2 imagefile.jpg
// ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/401 -ss 00:00:03 -t 00:00:08 -async 1 cut.mp4
// ffmpeg -ss -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/401 setpts=0.25*PTS -q:v 3 -update 1 -y test.png
// ffmpeg -ss 00:08:00 -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/401 -ss 00:01:00 -t 00:01:00 -c copy VideoClip.mp4
//ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/401 -vframes 5 -update 1
//ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/401 -vframes 5 -f image2 -update 1 -

async function readCameras() {
    let jsonData = await fs.readFileSync(__dirname + "/camera.json");
    return JSON.parse(jsonData);
}

// use rtsp = require('rtsp-ffmpeg') instead if you have install the package
server.listen(3000, function () {
    console.log('Listening on localhost:3000');
});
