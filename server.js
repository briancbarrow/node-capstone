var unirest = require('unirest');
var express = require('express');
var events = require('events');
var jsonfile = require('jsonfile');
var mongoose = require('mongoose');
var app = express();
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    // BSON = require('mongodb').pure().BSON,
    assert = require('assert');
app.use(express.static('public'));



var uri = process.env.MONGO_URI;
// var uri = 'mongodb://brianb:mongo2016@ds141937.mlab.com:41937/basketball-stats';


mongoose.connect(uri);

var Stat = mongoose.model('Moneypermin', { PlayerName: String, 
                                            Age: Number,
                                            Tm: String, 
                                            G: Number,
                                            GS: Number, 
                                            MP: Number, 
                                            FG: Number, 
                                            FGA: Number, 
                                            'FG%': Number, 
                                            '3P': Number, 
                                            '3PA': Number, 
                                            '2P': Number, 
                                            '2PA': Number, 
                                            '2P%': Number, 
                                            FT: Number, 
                                            FTA: Number, 
                                            'FT%': Number, 
                                            ORB: Number, 
                                            DRB: Number, 
                                            TRB: Number,  
                                            AST: Number,  
                                            STL: Number,  
                                            BLK: Number,  
                                            TOV: Number,  
                                            PF: Number,  
                                            PTS: Number,  
                                            ORTG: Number,  
                                            DRTG: Number,  
                                            TeamPace: Number,  
                                            AdjORtg: Number,  
                                            AdjDRtg: Number,  
                                            avgMin: Number,  
                                            IndPos: Number,  
                                            'Ortg/Min': Number,  
                                            'Drtg/Min': Number,  
                                            Diff: Number,  
                                            Salary: Number,  
                                            'Dollar/OffCont': Number,  
                                            'Dollar/DefCont': Number,  
                                            'Dollar/ContDiff': Number,  
                                            'Dollar/Minute': Number,  
                                            'Dollar/game': Number
}, 'moneypermin' );
// Stat.create({Player: 'Brian Barrow'}, function(err, created) {
//     console.log(arguments);
// });


app.get('/api/stats', function(req, res) {
    Stat.find(function(err, data) {
        res.json(data);
    });
});
app.listen(process.env.PORT || 8080);

exports.app = app;
// exports.storage = storage;