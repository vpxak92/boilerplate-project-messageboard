const mongoose = require('mongoose');
const replyModel = require('../models/replyModel');
const threadModel = require('../models/threadModel');
const boardModel = require('../models/boardModel');

exports.postThread = async (req, res) => {
  try {
    let board = req.body.board;
    if (board == undefined) {
      board = req.params.board;
    }
    let boardFind = await boardModel.findOne({ name: board }).exec();
    let threads = new threadModel({ board: board, text: req.body.text, delete_password: req.body.delete_password});
    threads.save();
    if (boardFind == null) {
      let newBoard = new boardModel({ name: board });
      newBoard.threads.push(threads._id);
      await newBoard.save();
    }
    else {
      await boardModel.findOneAndUpdate({ name: board }, { "$push": { threads: threads._id } });
    }
    res.redirect('/b/' + board);
  }
  catch (err) {
    return err;
  }
}

exports.getThread = async (req, res) => {
  try {
    let i = 0;
    let data = [];
    let findBoard = await boardModel.findOne({ name: req.params.board }).exec();
    while (i < 10) {
      let getId = findBoard.threads[i++];
      if (getId != undefined) {
        let threadFind = await threadModel.findById(getId).select('_id board text replies replycount created_on bumped_on __v');
        if (threadFind != null && threadFind.replies.length != 0) {
          threadFind.replies = [];
          let replyFind = await replyModel.find({ thread_id: threadFind._id }).select('_id text thread_id created_on bumped_on __v').limit(3).sort({ bumped_on: 'asc' });
          threadFind.replies = [...replyFind];
        }
        if (threadFind != null) {
          data.unshift(threadFind);
        }
      }
    }
    res.json(data);
  }
  catch (err) {
    return err;
  }
}

exports.deleteThread = async (req, res) => {
  try {
    let getPass = req.body.delete_password;
    var nid = new mongoose.Types.ObjectId(req.body.thread_id);
    let getThreadToDelete = await threadModel.findById(req.body.thread_id);
    if (getThreadToDelete.length != 0 && getThreadToDelete.delete_password == getPass) {
      await threadModel.findByIdAndDelete(req.body.thread_id);
      await boardModel.findOneAndUpdate({name: req.params.board}, { "$pull": { threads: nid }});
      res.send("success");
    } else {
      res.send("incorrect password");
    }
  }
  catch (err) {
    return err;
  }
}


exports.reportThread = async (req, res) => {
  try {
    let toReport = req.body.thread_id;
    if (toReport == undefined) {
      toReport = req.body.report_id;
    }
    let reportThread = await threadModel.findByIdAndUpdate(toReport, { reported: true });
    res.send("reported");
  }
  catch (err) {
    return err;
  }
}