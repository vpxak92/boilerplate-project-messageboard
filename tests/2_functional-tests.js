const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  test('Creating a new thread', function (done) {
    this.timeout(7777);
    chai.request(server).post('/api/threads/boardtocreate')
      .send({
        board: "boardtocreate",
        test: "thread_text",
        delete_password: "delete"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  test('Viewing the 10 most recent threads with 3 replies each', function (done) {
    this.timeout(10000);
    chai.request(server).get('/api/threads/board_to_look')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isBelow(res.body.length, 11);
        assert.isBelow(res.body[0].replies.length, 4);
        done();
      });
  });

  test('Reporting a thread', function (done) {
    chai.request(server).put('/api/threads/board_to_look')
      .send({
        thread_id: "6527ecf7d0605dc90b09012c",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "reported");
        done();
      });
  });

  test('Deleting a thread with the incorrect password', function (done) {
    chai.request(server).delete('/api/threads/board_to_look')
      .send({
        thread_id: "6527ecf7d0605dc90b09012c",
        delete_password: "wrongpass"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "incorrect password");
        done();
      });
  });

  test('Deleting a thread with the correct password', function (done) {
    chai.request(server).delete('/api/threads/board_to_look')
      .send({
        thread_id: "6527ecf7d0605dc90b09012c",
        delete_password: "goodpass"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "success");
        done();
      });
  });


  test('Creating a new reply', function (done) {
    chai.request(server).post('/api/replies/board_to_look')
      .send({
        text: "reptest",
        delete_password: "deleterep",
        thread_id: "6526ab973256fcbbd30d8a74"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  test('Viewing a single thread with all replies', function (done) {
    chai.request(server).get('/api/replies/board_to_look?thread_id=6527ed56d0605dc90b090141')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.replies);
        done();
      });
  });


  test('Reporting a reply', function (done) {
    chai.request(server).put('/api/threads/board_to_look')
      .send({
        thread_id: "6527ed16d0605dc90b090133",
        reply_id: "6527ed1fd0605dc90b090139",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "reported");
        done();
      });
  });

  test('Deleting a reply with the incorrect password', function (done) {
    chai.request(server).delete('/api/replies/board_to_look')
      .send({
        thread_id: "6527ed16d0605dc90b090133",
        reply_id: "6527ed1fd0605dc90b090139",
        delete_password: "wrongpass"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "incorrect password");
        done();
      });
  });

  test('Deleting a reply with the correct password', function (done) {
    chai.request(server).delete('/api/replies/board_to_look')
      .send({
        thread_id: "6527ed16d0605dc90b090133",
        reply_id: "6527ed1fd0605dc90b090139",
        delete_password: "goodpass"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "success");
        done();
      });
  });
});