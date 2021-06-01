var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr){
        if(stderr){
            return callback(stderr);
        }
        callback(stdout);
    });
};
let imageData = [];
execute("ffmpeg -rtsp_transport tcp -i rtsp://admin:ADMIN@12@136.233.89.172:1024/Streaming/Channels/401 -vframes 5 -update 1 ./video/picture-1024-401.jpg");

