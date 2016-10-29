"use strict";

const app = require('../app');
const request = require('request-promise').defaults({
  resolveWithFullResponse: true,
  simple: false
});

var {User} = require('../db/index');

function getURL(path) {
  return `http://localhost:3003${path}`;
};

describe("User REST API", function() {

  before(function(done) {
    this.server = app.listen(3003, done);
  });

  after(function(done) {
    this.server.close(done);
  });

  let existingUserData = {
    email: "john@test.ru",
    displayName: "John",
    password: '123456'
  };
  let newUserData = {
    email: "alice@test.ru",
    displayName: "Alice",
    password: '123456'
  };
  let existingUser;

  beforeEach(function*() {
    // load fixtures
    yield User.remove({});
    existingUser = yield User.create(existingUserData);
  });

  describe("POST /api/user", function() {
    it("creates a user", function*() {
      let response = yield request({
        method: 'POST',
        url: getURL('/api/user'),
        json: true,
        body: newUserData
      });
      console.log(response.body);
      response.body.displayName.should.eql(newUserData.displayName);
      response.body.email.should.eql(newUserData.email);
    });

    it("throws if email already exists", function*() {
      let response = yield request({
        method: 'POST',
        url: getURL('/api/user'),
        json: true,
        body: existingUserData
      });
      response.statusCode.should.eql(400);
      response.body.errors.email.should.exist;
    });

    it("throws if email not valid", function*() {
      let response = yield request({
        method: 'POST',
        url: getURL('/api/user'),
        json: true,
        body: {
          email: "invalid"
        }
      });
      response.statusCode.should.eql(400);
    });

  });

  describe("GET /user/:userById", function() {
    it("gets the user by id", function*() {
      let response = yield request.get(getURL('/api/user/' + existingUser._id));
      JSON.parse(response.body).email.should.exist;
      response.statusCode.should.eql(200);
      response.headers['content-type'].should.match(/application\/json/);
    });

    it("returns 404 if user does not exist", function*() {
      let response = yield request.get(getURL('/api/user/55b693486e02c26010ef0000'));
      response.statusCode.should.eql(404);
    });

    it("returns 404 if invalid id", function*() {
      let response = yield request.get(getURL('/api/user/kkkkk'));
      response.statusCode.should.eql(404);
    });
  });

  describe("DELETE /user/:userById", function() {
    it("removes user", function*() {
      let response = yield request.del(getURL('/api/user/' + existingUser._id));
      response.statusCode.should.eql(200);
      let users = yield User.find({}).exec();
      users.length.should.eql(0);
    });

    it("returns 404 if the user does not exist", function*() {
      let response = yield request.del(getURL('/api/user/55b693486e02c26010ef0000'));
      response.statusCode.should.eql(404);
    });
  });

  it("GET /api/user gets all users", function*() {
    let response = yield request.get(getURL('/api/user'));
    response.statusCode.should.eql(200);
    response.headers['content-type'].should.match(/application\/json/);
    JSON.parse(response.body).length.should.eql(1);
  });
});