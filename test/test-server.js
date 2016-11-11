var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Capstone', function() {
    it('should return data points on get', function(done) {
        chai.request(app)
            .get('/api/moneypermin')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.body.should.not.equal('null');
                res.should.be.json;
                res.body[0].Player.should.be.a('string');
                done();
            });
    });
});