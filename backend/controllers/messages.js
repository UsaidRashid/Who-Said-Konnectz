const Messages = require("../models/messages");

module.exports.saveMessage = async (fromId, toId, message) => {
  try {
    const newMessage = new Messages({
      fromId,
      toId,
      message,
      timestamp: new Date(),
      delivered: false,
    });

    await newMessage.save();
    return { success: true, message: "Message saved successfully" };
  } catch (error) {
    console.error("Error saving message:", error);
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
};

module.exports.fetchMessages = async (req, res) => {
  try {
    const { fromId, toId } = req.body;

    const messages = await Messages.find({
      $or: [
        { fromId, toId },
        { fromId: toId, toId: fromId },
      ],
    }).sort({ timestamp: 1 });

    await Messages.updateMany(
      { fromId: toId, toId: fromId, delivered: false },
      { $set: { delivered: true } }
    );

    return res
      .status(200)
      .json({ message: "Messages Fetched Successfully", messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
