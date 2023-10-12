const mongoose = require('mongoose');

const BoardSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'threadModel'
    }
  ]
}, { timestamps: {
    createdAt: 'created_on', 
    updatedAt: 'bumped_on' 
  }
});

module.exports = mongoose.model('boardModel', BoardSchema);