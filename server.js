var unirest = require('unirest');
var express = require('express');
var events = require('events');
var jsonfile = require('jsonfile');
var app = express();
app.use(express.static('public'));

app.listen(process.env.PORT || 8080);

// var getFromApi = function(args) {
//     var emitter = new events.EventEmitter();
//     unirest.post('https://probasketballapi.com/stats/players/')
//           .qs(args)
//           .end(function(response) {
//                 if (response.ok) {
//                     emitter.emit('end', response.body);
//                     jsonfile.writeFile('public/data.json', response.body, function (err) {
//                       console.error(err);
//                     });
//                 }
//                 else {
//                     emitter.emit('error', response.code);
//                 }
//             });
//     jsonfile.writeFile('public/data.json', emitter, function (err) {
//       console.error(err);
//     });
//     // return emitter;
// };

// getFromApi({api_key: 'K6Rk27YUc5philzJXBjAevmQn0aNSsfD', season: '2015', team_id: 1610612745});

exports.app = app;
// exports.storage = storage;