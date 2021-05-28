// const Stream = require('node-rtsp-stream');
// try{
//     stream = new Stream({
//         name: 'name',
//         streamUrl: 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/301 :network-caching=1000 :sout=#transcode{vcodec=theo,vb=1600,scale=1,acodec=none}:http{mux=ogg,dst=:8181/stream} :no-sout-rtp-sap :no-sout-standard-sap :sout-keep',
//         wsPort: 9999,
//         ffmpegOptions: { // options ffmpeg flags
//             '-stats': '', // an option with no neccessary value uses a blank string
//             '-r': 30 // options with required values specify the value after the key
//         }
//     });
//
//       // stream.start();
// }catch (e) {
//     console.log(e);
// }

//ffplay -i rtsp://127.0.0.1:6554/stream1
// ffmpeg -i ./video/DynamicFileNameHere.mp4 -c:v copy -f rtsp rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/202
// const Stream = require('videoStream')
const http = require('http');
const Stream = require('node-rtsp-stream-es6')
const options = {
    name: 'streamName',
    url: 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/202',
    port: 9000,
    fps: '24',
    kbs: '2048k',
    ffmpegOptions: { // options ffmpeg flags
            '-stats': '', // an option with no neccessary value uses a blank string
            '-r': 30 // options with required values specify the value after the key
        }
}
let stream = new Stream(options);
stream.start();
// const server = http.createServer((req,res)=>{
//     let stream = new Stream(options)
//     stream.pipe(res);
// })

// server.listen(3000);


// ffmpeg -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/202 -c copy -map 0 -f segment -segment_time 600 -segment_format mp4 out.mp4
// ffmpeg -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/202 -c:a aac -vcodec copy video\2020-2-18-12-18-25.mp4


// ffmpeg -re -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/202 -c:v copy -c:a copy -f flv input.mp4
// const  {default: Recorder, RecorderEvents} = require('node-rtsp-recorder');
//
// const Recorder = require('../src/helpers/recorder')
// let rec = new Recorder({
//     url: 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/202',
//     timeLimit: 60, // time in seconds for each segmented video file
//     folder: 'video',
//     name: 'cam1',
//     type: 'image',
//     directoryPathFormat: 'MMM-D-YYYY',
//     fileNameFormat: 'M-D-h-mm-ss',
// });
// // Starts Recording
// rec.startRecording();
// // rec.captureImage(() => {
// //     console.log('Image Captured')
// // })
// ffmpeg -i rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/202 -vcodec copy recording.mp4
//  // Recorder, { RecorderEvents } from 'rtsp-video-recorder';

// const Recorder = require('node-rtsp-recorder').Recorder
//
// let rec = new Recorder({
//     url: 'rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/202',
//     timeLimit: 60, // time in seconds for each segmented video file
//     folder: 'video/',
//     name: 'cam1',
//     type: 'image',
// })
// // Starts Recording
// // console.log('Before Start',rec.isRecording());
//  rec.startRecording();
// console.log('Before Start',rec.isRecording());
// rec.captureImage(() => {
//     console.log('Image Captured')
// })
// console.log('Before Start',rec.isRecording());
// setTimeout(() => {
//     console.log('Stopping Recording')
//     rec.stopRecording()
//     rec = null
// }, 300000)


// var ffmpeg = require('fluent-ffmpeg');
//
// var record = ffmpeg('rtsp://admin:ADMIN@12@136.233.89.172:554/Streaming/Channels/202')
//     // .setDuration("0:05")
//     .on('end', function () {
//         console.log('saved');
//     })
//     .on('progress', (progress) => {
//         console.log('Processing: ' + progress.targetSize + ' KB converted');
//     })
//     .on('error', function (err) {
//         console.log('error: ' + err);
//     })
//     .save('video/output3.mp4');
//
// record.startRecord();
