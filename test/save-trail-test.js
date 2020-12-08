var expect = require('chai').expect;
var request = require('supertest');
var app = require('../server');

describe('App', function() {
  it('should return a 200 response', function(done) {
    request(app).get('/savedTrails').expect(200, done);
  });
});
