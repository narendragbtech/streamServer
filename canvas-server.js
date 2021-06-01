const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const server = require('http').Server(app)
    , io = require('socket.io')(server)
    , rtsp = require('rtsp-ffmpeg'),
    exec = require('child_process').exec;
// use rtsp = require('rtsp-ffmpeg') instead if you have install the package
server.listen(80, function () {
    console.log('Listening on localhost:80');
});

app.use(express.static(path.join(__dirname, "video")));

var cams = [
    {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/101', code: '1024 | 101'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/201', code: '1024 | 201'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/301', code: '1024 | 301'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/401', code: '1024 | 401'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/501', code: '1024 | 501'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/601', code: '1024 | 601'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/701', code: '1024 | 701'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/801', code: '1024 | 801'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/901', code: '1024 | 901'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1001', code: '1024 | 1001'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1101', code: '1024 | 1101'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1201', code: '1024 | 1201'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1301', code: '1024 | 1301'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1401', code: '1024 | 1401'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1501', code: '1024 | 1501'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1601', code: '1024 | 1601'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1701', code: '1024 | 1701'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1801', code: '1024 | 1801'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/1901', code: '1024 | 1901'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/2001', code: '1024 | 2001'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/2101', code: '1024 | 2101'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/2201', code: '1024 | 2201'}

    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/101', code: '1025 | 101'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/201', code: '1025 | 201'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/301', code: '1025 | 301'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/401', code: '1025 | 401'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/501', code: '1025 | 501'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/601', code: '1025 | 601'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/701', code: '1025 | 701'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/801', code: '1025 | 801'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/901', code: '1025 | 901'}
    , {url: 'rtsp://admin:ADMIN@12@136.233.89.172:1025/Streaming/Channels/1001', code: '1025 | 1001'}

].map(function (uri, i) {
    var stream = new rtsp.FFMpeg({
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
    ns.on('get-image', function (data) {

    });
});

io.on('connection', function (socket) {
    let number = Math.random();
    let code = cams.map(i => i.channel);
    socket.emit('start', code);
   //  getImage('rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/401','./video/picture-'+number+'.jpg', (type,object)=>{
   //      console.log('execution',type);
   //      if(type ===2){
   //          let code = cams.map(i => i.channel);
   //            fs.readFile(__dirname+"/video/picture-"+number+".jpg",(err,data)=>{
   //                if(!err){
   //                    console.log(data);
   //                    socket.emit('start',data.toString('base64'));
   //                }
   //                console.log(err);
   //              return;
   //          })
   //      }
   //  });

});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index-canvas.html');
});
// "ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/401 -vframes 5 -update 1 ./video/picture-1024-401.jpg"
function getImage(url,file_name,callback) {
    let args = ['ffmpeg','-rtsp_transport tcp -i ',url,'-vframes 5','-update 1',file_name];
    console.log(args.join(" "));
    execute(args.join(" "),callback);
}

function execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
        if (error) {
            console.error(`exec error: ${error}`);
           return ;
        }
        return callback(2,stdout);
    });
}
