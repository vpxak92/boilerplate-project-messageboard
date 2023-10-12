'use strict';

const mongoose = require('mongoose');
const path = require('path');
let threadHandlers = require("../controllers/threadHandlers");
let replyHandlers = require("../controllers/replyHandlers");

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(threadHandlers.postThread)
    .get(threadHandlers.getThread)
    .delete(threadHandlers.deleteThread)
    .put(threadHandlers.reportThread)
    
  app.route('/api/replies/:board')
    .post(replyHandlers.postReplies)
    .get(replyHandlers.getReplies)
    .delete(replyHandlers.deleteReplies)
    .put(replyHandlers.reportReplies)
};
