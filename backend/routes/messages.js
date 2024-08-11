const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messages");

router.route("/fetch-messages").post(messageController.fetchMessages);

module.exports = router;
