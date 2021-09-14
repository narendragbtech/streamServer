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
    {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/101',
        code: '1026 | 101',
        image: '1026101'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/201',
        code: '1026 | 201',
        image: '1026201'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/301',
        code: '1026 | 301',
        image: '1026301'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/401',
        code: '1026 | 401',
        image: '1026401'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/501',
        code: '1026 | 501',
        image: '1026501'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/601',
        code: '1026 | 601',
        image: '1026601'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/701',
        code: '1026 | 701',
        image: '1026701'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/801',
        code: '1026 | 801',
        image: '1026801'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/901',
        code: '1026 | 901',
        image: '1026901'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/1001',
        code: '1026 | 1001',
        image: '10261001'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/1101',
        code: '1026 | 1101',
        image: '10261101'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/1201',
        code: '1026 | 1201',
        image: '10261201'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/1301',
        code: '1026 | 1301',
        image: '10261301'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/1401',
        code: '1026 | 1401',
        image: '10261401'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/1501',
        code: '1026 | 1501',
        image: '10261501'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1026/Streaming/Channels/1601',
        code: '1026 | 1601',
        image: '10261601'
    }

    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/101',
        code: '1027 | 101',
        image: '1027101'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/201',
        code: '1027 | 201',
        image: '1027201'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/301',
        code: '1027 | 301',
        image: '1027301'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/401',
        code: '1027 | 401',
        image: '1027401'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/501',
        code: '1027 | 501',
        image: '1027501'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/601',
        code: '1027 | 601',
        image: '1027601'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/701',
        code: '1027 | 701',
        image: '1027701'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/801',
        code: '1027 | 801',
        image: '1027801'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/901',
        code: '1027 | 901',
        image: '1027901'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/1001',
        code: '1027 | 1001',
        image: '10271001'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/1101',
        code: '1027 | 1101',
        image: '10271101'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/1201',
        code: '1027 | 1201',
        image: '10271201'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/1301',
        code: '1027 | 1301',
        image: '10271301'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/1401',
        code: '1027 | 1401',
        image: '10271401'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/1501',
        code: '1027 | 1501',
        image: '10271501'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1027/Streaming/Channels/1601',
        code: '1027 | 1601',
        image: '10271601'
    }
    , {
        url: 'rtsp://admin:dvr12345@103.81.13.218:554/Streaming/Channels/101',
        code: '554 | 101',
        image: '554101'
    } , {
        url: 'rtsp://admin:dvr12345@103.81.13.218:554/Streaming/Channels/201',
        code: '554 | 201',
        image: '554201'
    }, {
        url: 'rtsp://admin:dvr12345@103.81.13.218:554/Streaming/Channels/301',
        code: '554 | 301',
        image: '554301'
    }, {
        url: 'rtsp://admin:dvr12345@103.81.13.218:554/Streaming/Channels/401',
        code: '554 | 401',
        image: '554401'
    }, {
        url: 'rtsp://admin:dvr12345@103.81.13.218:554/Streaming/Channels/501',
        code: '554 | 501',
        image: '554501'
    }, {
        url: 'rtsp://admin:dvr12345@103.81.13.218:554/Streaming/Channels/601',
        code: '554 | 601',
        image: '554601'
    }

    // -------------- ICU 1029
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/1501',
        code: '1029 | 1501',
        image: '10291501'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/1401',
        code: '1029 | 1401',
        image: '10291401'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/1301',
        code: '1029 | 1301',
        image: '10291301'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/1201',
        code: '1029 | 1201',
        image: '10291201'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/1101',
        code: '1029 | 1101',
        image: '10291101'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/1001',
        code: '1029 | 1001',
        image: '10291001'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/901',
        code: '1029 | 901',
        image: '1029901'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/801',
        code: '1029 | 801',
        image: '1029801'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/701',
        code: '1029 | 701',
        image: '1029701'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/601',
        code: '1029 | 601',
        image: '1029601'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/501',
        code: '1029 | 501',
        image: '1029501'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/401',
        code: '1029 | 401',
        image: '1029401'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/301',
        code: '1029 | 301',
        image: '1029301'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/201',
        code: '1029 | 201',
        image: '1029201'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1029/Streaming/Channels/101',
        code: '1029 | 101',
        image: '1029101'
    }
    // -------------- ICU 1028
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/1501',
        code: '1028 | 1501',
        image: '10281501'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/1401',
        code: '1028 | 1401',
        image: '10281401'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/1301',
        code: '1028 | 1301',
        image: '10281301'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/1201',
        code: '1028 | 1201',
        image: '10281201'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/1101',
        code: '1028 | 1101',
        image: '10281101'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/1001',
        code: '1028 | 1001',
        image: '10281001'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/901',
        code: '1028 | 901',
        image: '1028901'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/801',
        code: '1028 | 801',
        image: '1028801'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/701',
        code: '1028 | 701',
        image: '1028701'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/601',
        code: '1028 | 601',
        image: '1028601'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/501',
        code: '1028 | 501',
        image: '1028501'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/401',
        code: '1028 | 401',
        image: '1028401'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/301',
        code: '1028 | 301',
        image: '1028301'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/201',
        code: '1028 | 201',
        image: '1028201'
    }
    , {
        url: 'rtsp://rtspadmin:Nscirtsp@12@115.242.233.166:1028/Streaming/Channels/101',
        code: '1028 | 101',
        image: '1028101'
    }

];
const captureImages = [
    {code: 1026101, path: "images/picture_1026101.jpg"}, {
        code: 1026201,
        path: "images/picture_1026201.jpg"
    },
    {code: 1026301, path: "images/picture_1026301.jpg"}, {
        code: 1026401,
        path: "images/picture_1026401.jpg"
    }, {code: 1026501, path: "images/picture_1026501.jpg"}, {code: 1026601, path: "images/picture_1026601.jpg"},
    {code: 1026701, path: "images/picture_1026701.jpg"}, {
        code: 1026801,
        path: "images/picture_1026801.jpg"
    }, {code: 1026901, path: "images/picture_1026901.jpg"}, {
        code: 10261001,
        path: "images/picture_10261001.jpg"
    }, {code: 10261101, path: "images/picture_10261101.jpg"}, {code: 10261201, path: "images/picture_10261201.jpg"},
    {code: 10261301, path: "images/picture_10261301.jpg"}, {
        code: 10261401,
        path: "images/picture_10261401.jpg"
    }, {code: 10261501, path: "images/picture_10261501.jpg"}, {
        code: 10261601,
        path: "images/picture_10261601.jpg"
    },

    {code: 1027101, path: "images/picture_1027101.jpg"},
    {
        code: 1027201,
        path: "images/picture_1027201.jpg"
    }, {code: 1027301, path: "images/picture_1027301.jpg"}, {
        code: 1027401,
        path: "images/picture_1027401.jpg"
    }, {code: 1027501, path: "images/picture_1027501.jpg"}, {code: 1027601, path: "images/picture_1027601.jpg"},
    {code: 1027701, path: "images/picture_1027701.jpg"}, {
        code: 1027801,
        path: "images/picture_1027801.jpg"
    }, {code: 1027901, path: "images/picture_1027901.jpg"}, {code: 10271001, path: "images/picture_10271001.jpg"},

    {code: 10271101, path: "images/picture_10271101.jpg"},
    {code: 10271201, path: "images/picture_10271201.jpg"}, {
        code: 10271301,
        path: "images/picture_10271301.jpg"
    }, {code: 10271401, path: "images/picture_10271401.jpg"},

    {
        code: 10271501,
        path: "images/picture_10271501.jpg"
    },
    {code: 10271601, path: "images/picture_10271601.jpg"},

    {code: 554101, path: "images/picture_554101.jpg"},
    {code: 554201, path: "images/picture_554201.jpg"},
    {code: 554301, path: "images/picture_554301.jpg"},
    {code: 554401, path: "images/picture_554401.jpg"},
    {code: 554501, path: "images/picture_554501.jpg"},
    {code: 554601, path: "images/picture_554601.jpg"},

    // icu

    {code: 1029101, path: "images/picture_1029101.jpg"},
    {code: 1029201, path: "images/picture_1029201.jpg"},
    {code: 1029301, path: "images/picture_1029301.jpg"},
    {code: 1029401, path: "images/picture_1029401.jpg"},
    {code: 1029501, path: "images/picture_1029501.jpg"},
    {code: 1029601, path: "images/picture_1029601.jpg"},

    {code: 1029701, path: "images/picture_1029701.jpg"},
    {code: 1029801, path: "images/picture_1029801.jpg"},
    {code: 1029901, path: "images/picture_1029901.jpg"},
    {code: 10291001, path: "images/picture_10291001.jpg"},
    {code: 10291101, path: "images/picture_10291101.jpg"},
    {code: 10291201, path: "images/picture_10291201.jpg"},
    {code: 10291301, path: "images/picture_10291301.jpg"},
    {code: 10291401, path: "images/picture_10291401.jpg"},
    {code: 10291501, path: "images/picture_10291501.jpg"},

    {code: 1028101, path: "images/picture_1028101.jpg"},
    {code: 1028201, path: "images/picture_1028201.jpg"},
    {code: 1028301, path: "images/picture_1028301.jpg"},
    {code: 1028401, path: "images/picture_1028401.jpg"},
    {code: 1028501, path: "images/picture_1028501.jpg"},
    {code: 1028601, path: "images/picture_1028601.jpg"},

    {code: 1028701, path: "images/picture_1028701.jpg"},
    {code: 1028801, path: "images/picture_1028801.jpg"},
    {code: 1028901, path: "images/picture_1028901.jpg"},
    {code: 10281001, path: "images/picture_10281001.jpg"},
    {code: 10281101, path: "images/picture_10281101.jpg"},
    {code: 10281201, path: "images/picture_10281201.jpg"},
    {code: 10281301, path: "images/picture_10281301.jpg"},
    {code: 10281401, path: "images/picture_10281401.jpg"},
    {code: 10281501, path: "images/picture_10281501.jpg"},

];
const liveStream = [];

function startStream(object) {
    let findStreamIndex = liveStream.findIndex(s => s.code === object.image);
    if (findStreamIndex === -1) {
        let stream = new rtsp.FFMpeg({
            input: object.url,
            resolution: '1280x720',
            quality: 5,
            arguments: ['-rtsp_transport', 'tcp']
        });
        console.log("New Stream Start : " + object.image);
        liveStream.push({stream: stream, code: object.image});

        stream.on('start', function () {
            console.log('stream ' + object.image + ' started');
            console.log("Live Stream Length", liveStream.length);
        });
        stream.on('stop', function () {
            console.log('stream ' + object.image + ' stopped');
            liveStream.splice(findStreamIndex, 1);
            console.log("Live Stream Length", liveStream.length);
        });

        return {stream: stream, code: object.image};
    } else {
        return liveStream[findStreamIndex];
    }
}

camList.forEach((object, i) => {
    let ns = io.of('/' + object.image);

    ns.on('connection', function (wsocket) {
        console.log('New Live Camera Request For ' + object.image);
        let StreamObject = startStream(object);
        let pipeStream = function (data) {
            wsocket.emit('data', data);
        };
        StreamObject.stream.on('data', pipeStream);
        wsocket.on('disconnect', function () {
            console.log('disconnected from /cam' + object.image);
            StreamObject.stream.removeListener('data', pipeStream);
        });
    });
});

setInterval(capture, 120000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/video-server.html');
});

app.get('/getImages', (req, res) => {
    res.json(captureImages);
});

function capture() {
    let AllChildProcess = captureStreamImages();
    Promise.all(AllChildProcess).then(r => {
        console.log("Capture Image Process Finished");
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
                // console.log(`camera ${cam.image} image update`)
                //filenames.push({image: `images/picture_${cam.image}.jpg`, code: "/" + cam.image, number: cam.image});
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

