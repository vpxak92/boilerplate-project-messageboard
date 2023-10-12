const mongoose = require('mongoose');

const ReplySchema = new  mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  delete_password: {
    type: String,
    required: true
  },
  reported: {
    type: Boolean,
    default: false
  },
  thread_id: {
    type: String,
    required: true
  }
}, { timestamps: {
    createdAt: 'created_on', 
    updatedAt: 'bumped_on' 
  }
});

module.exports = mongoose.model('replyModel', ReplySchema);
