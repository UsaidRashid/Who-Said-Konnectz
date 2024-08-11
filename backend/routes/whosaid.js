const express = require("express");
const router = express.Router();
const whoSaidController = require("../controllers/whosaid");

router.route("/save").post(whoSaidController.saveWhoSaid);
router.route("/fetch").post(whoSaidController.fetchWhoSaids);

module.exports = router;
