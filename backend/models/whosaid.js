const mongoose = require("mongoose");

const whoSaidSchema = new mongoose.Schema({
  said: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("WhoSaid", whoSaidSchema);
