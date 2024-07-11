const express = require("express");
const router = express.Router();
const commentsController = require('../controllers/comments');

router
    .route("/new")
        .post(commentsController.createComment);

router
    .route("/toggleLike")
        .post(commentsController.toggleLike);


module.exports = router;