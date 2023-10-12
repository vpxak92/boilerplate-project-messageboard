const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  delete_password: {
    type: String,
    required: true
  },
  replycount: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'replyModel'
    }
  ]
}, { timestamps: {
    createdAt: 'created_on', 
    updatedAt: 'bumped_on' 
  }
});

module.exports = mongoose.model('threadModel', ThreadSchema);
