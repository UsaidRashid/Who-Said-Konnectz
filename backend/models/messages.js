const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  fromId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
