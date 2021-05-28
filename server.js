const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const STREAM_SECRET = '';
const STREAM_PORT =  9002;
const WEBSOCKET_PORT = 9003;
const RECORD_STREAM = false;


// Websocket Server
const socketServer = new WebSocket.Server({port: WEBSOCKET_PORT, perMessageDeflate: false});
socketServer.connectionCount = 0;

socketServer.on('connection', function(socket, upgradeReq) {
    socketServer.connectionCount++;
    console.log('New WebSocket Connection: ',
        (upgradeReq || socket.upgradeReq).socket.remoteAddress,
        (upgradeReq || socket.upgradeReq).headers['user-agent'],
        '('+socketServer.connectionCount+' total)'
    );
    socket.on('close', function(code, message){
        socketServer.connectionCount--;
        console.log(
            'Disconnected WebSocket ('+socketServer.connectionCount+' total)'
        );
    });
});

socketServer.broadcast = function(data) {
    socketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

const streamServer = http.createServer( function(request, response) {
    let params = request.url;
    console.log('Parameter',params);
    request.on('data', function(data){
        socketServer.broadcast(data);
        if (request.socket.recording) {
            request.socket.recording.write(data);
        }
    });

    request.on('end',function(){
        console.log('close');
        if (request.socket.recording) {
            request.socket.recording.close();
        }
    });

    // Record the stream to a local file?
    if (RECORD_STREAM) {
        let path = 'video/' + Date.now() + '.ts';
        request.socket.recording = fs.createWriteStream(path);
    }
});
// Keep the socket open for streaming
streamServer.headersTimeout = 0;
streamServer.listen(STREAM_PORT);

console.log(`Listening for incomming MPEG-TS Stream on http://127.0.0.1:${STREAM_PORT}`);
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');
