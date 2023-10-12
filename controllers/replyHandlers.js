const mongoose = require('mongoose');
const replyModel = require('../models/replyModel');
const threadModel = require('../models/threadModel');
const boardModel = require('../models/boardModel');

exports.postReplies = async (req, res) => {
  try{
    let board2 = req.query.board;
    if (board2 == undefined) {
      board2 = req.params.board;
    }
    let newReply = new replyModel({text: req.body.text, delete_password: req.body.delete_password, thread_id: req.body.thread_id, created_on: new Date().toUTCString()});
    await threadModel.findOneAndUpdate({ _id: req.body.thread_id }, { bumped_on: new Date().toUTCString() } ,{ timestamps: false });
    await threadModel.findOneAndUpdate({_id: req.body.thread_id}, {"$push": { replies: newReply._id }} ,{ timestamps: false });
    await threadModel.findOneAndUpdate({_id: req.body.thread_id}, {"$inc": { replycount: 1 }} ,{ timestamps: false });
    newReply.save();
    await res.redirect('/b/' + board2 + '/' + req.body.thread_id);
  }
  catch(err) {
    return err;
  }
}

exports.getReplies = async (req, res) => {
  try{
    var nido = new mongoose.Types.ObjectId(req.query.thread_id);
    let findThread = await threadModel.findOne({_id: nido}).select('_id board text replies created_on bumped_on __v');
    let nbOfReplies = findThread.replies.length;
    findThread.replies = [];
    let findAllReplies = await replyModel.find({thread_id: req.query.thread_id}).select('_id text thread_id created_on bumped_on __v');
    findThread.replies = [...findAllReplies];
    let data = findThread;
    res.json(data);
  }
  catch(err) {
    return err;
  }
}

exports.deleteReplies = async (req, res) => {
  try {
    var nid = new mongoose.Types.ObjectId(req.body.reply_id);
    let replyGet = await replyModel.findById(req.body.reply_id)
    if (replyGet.delete_password == req.body.delete_password) {
      await threadModel.findByIdAndUpdate(req.body.thread_id, {"$inc": { replycount: -1 }});
      await replyModel.findByIdAndUpdate(req.body.reply_id, { text: "[deleted]" } );
      res.send("success");
    } else {
      res.send("incorrect password");
    }
  }
  catch (err) {
    return err;
  }
}

exports.reportReplies = async (req, res) => {
  try {
    let replyId = req.body.reply_id;
    let reportReply = await replyModel.findByIdAndUpdate(replyId, { reported: true });
    res.send("reported");
  }
  catch (err) {
    return err;
  }
}