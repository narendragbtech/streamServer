const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app)
const io = require('socket.io')(server);
const rtsp = require('rtsp-ffmpeg');
const {spawn} = require("child_process");
require('console-stamp')(console, {format: ':date(yyyy/mm/dd HH:MM:ss.l)'});
server.listen(80, function () {
    console.log('Listening on localhost:80');
});

app.use(express.static(path.join(__dirname, "public")));
const camList = [
    {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/101', code: '1024 | 101', image: '1024101'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/201', code: '1024 | 201', image: '1024201'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/301', code: '1024 | 301', image: '1024301'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/401', code: '1024 | 401', image: '1024401'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/501', code: '1024 | 501', image: '1024501'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/601', code: '1024 | 601', image: '1024601'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/701', code: '1024 | 701', image: '1024701'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/801', code: '1024 | 801', image: '1024801'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/901', code: '1024 | 901', image: '1024901'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1001', code: '1024 | 1001', image: '10241001'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1101', code: '1024 | 1101', image: '10241101'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1201', code: '1024 | 1201', image: '10241201'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1301', code: '1024 | 1301', image: '10241301'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1401', code: '1024 | 1401', image: '10241401'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1501', code: '1024 | 1501', image: '10241501'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1601', code: '1024 | 1601', image: '10241601'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1701', code: '1024 | 1701', image: '10241701'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1801', code: '1024 | 1801', image: '10241801'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1901', code: '1024 | 1901', image: '10241901'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/2001', code: '1024 | 2001', image: '10242001'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/2101', code: '1024 | 2101', image: '10242101'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/2201', code: '1024 | 2201', image: '10242201'}

    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/101', code: '1025 | 101', image: '1025101'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/201', code: '1025 | 201', image: '1025201'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/301', code: '1025 | 301', image: '1025301'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/401', code: '1025 | 401', image: '1025401'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/501', code: '1025 | 501', image: '1025501'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/601', code: '1025 | 601', image: '1025601'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/701', code: '1025 | 701', image: '1025701'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/801', code: '1025 | 801', image: '1025801'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/901', code: '1025 | 901', image: '1025901'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/1001', code: '1025 | 1001', image: '10251001'}

];
const captureImages = [
    {code: 1024101, path: "images/picture_1024101.jpg"}, {
        code: 1024201,
        path: "images/picture_1024201.jpg"
    },
    {code: 1024301, path: "images/picture_1024301.jpg"}, {
        code: 1024401,
        path: "images/picture_1024401.jpg"
    }, {code: 1024501, path: "images/picture_1024501.jpg"}, {code: 1024601, path: "images/picture_1024601.jpg"},
    {code: 1024701, path: "images/picture_1024701.jpg"}, {
        code: 1024801,
        path: "images/picture_1024801.jpg"
    }, {code: 1024901, path: "images/picture_1024901.jpg"}, {
        code: 10241001,
        path: "images/picture_10241001.jpg"
    }, {code: 10241101, path: "images/picture_10241101.jpg"}, {code: 10241201, path: "images/picture_10241201.jpg"},
    {code: 10241301, path: "images/picture_10241301.jpg"}, {
        code: 10241401,
        path: "images/picture_10241401.jpg"
    }, {code: 10241501, path: "images/picture_10241501.jpg"}, {
        code: 10241601,
        path: "images/picture_10241601.jpg"
    }, {code: 10241701, path: "images/picture_10241701.jpg"},
    {code: 10241801, path: "images/picture_10241801.jpg"}, {
        code: 10241901,
        path: "images/picture_10241901.jpg"
    }, {code: 10242001, path: "images/picture_10242001.jpg"}, {
        code: 10242101,
        path: "images/picture_10242101.jpg"
    }, {code: 10242201, path: "images/picture_10242201.jpg"},
    {code: 1025101, path: "images/picture_1025101.jpg"}, {
        code: 1025201,
        path: "images/picture_1025201.jpg"
    }, {code: 1025301, path: "images/picture_1025301.jpg"}, {
        code: 1025401,
        path: "images/picture_1025401.jpg"
    }, {code: 1025501, path: "images/picture_1025501.jpg"}, {code: 1025601, path: "images/picture_1025601.jpg"},
    {code: 1025701, path: "images/picture_1025701.jpg"}, {
        code: 1025801,
        path: "images/picture_1025801.jpg"
    }, {code: 1025901, path: "images/picture_1025901.jpg"}, {code: 10251001, path: "images/picture_10251001.jpg"}
];

let cams = camList.map((uri, i) => {
    let stream = new rtsp.FFMpeg({
        input: uri.url,
        resolution: '704*576',
        quality: 12,
        arguments: ['-rtsp_transport', 'tcp']
    });

    let channel_number = uri.code;
    stream.on('start', function () {
        console.log('stream ' + channel_number + ' started');
    });
    stream.on('stop', function () {
        console.log('stream ' + channel_number + ' stopped');
    });
    return {stream: stream, channel: channel_number};
});

cams.forEach((object, i) => {
    let ns = io.of('/' + object.channel);
    ns.on('connection', function (wsocket) {
        console.log('connected to /cam' + object.channel);
        let pipeStream = function (data) {
            wsocket.emit('data', data);
        };
        object.stream.on('data', pipeStream);

        wsocket.on('disconnect', function () {
            console.log('disconnected from /cam' + object.channel);
            object.stream.removeListener('data', pipeStream);
        });
    });
});

let interval = setInterval(capture, 120000);
io.on('connection', function (socket) {
    socket.emit('capture', captureImages);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index-canvas.html');
});

app.get('/getImages', (req, res) => {
    res.json(captureImages);
});

function capture() {
    let AllChildProcess = captureStreamImages();
    Promise.all(AllChildProcess).then(r => {
        console.log("Capture Image Process Finished");
            if (!interval)
                clearInterval(interval);
    }).catch(error => {
        console.log(error);
    });
}

function captureStreamImages() {
    return camList.map(cam => {
        return new Promise((resolve, reject) => {
            let filename = `./public/images/picture_${cam.image}.jpg`;
            let ls = spawn("ffmpeg",
                ["-rtsp_transport", "tcp", "-i", cam.url, "-vframes", "10", "-q:v", "5", "-f", "image2", "-update", "1", "-y", filename]);
            ls.on("close", code => {
                console.log(`child process exited with code ${code}`);
                // filenames.push({image: `images/picture_${cam.image}.jpg`, code: "/" + cam.image, number: cam.image});
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

// "ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/401 -vframes 5 -update 1 ./public/picture-1024-401.jpg"
function getImage(url, file_name, callback) {
    let args = ['ffmpeg', '-rtsp_transport tcp -i ', url, '-vframes 5', '-update 1', file_name];
    console.log(args.join(" "));
    execute(args.join(" "), callback);
}

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        return callback(2, stdout);
    });
}
