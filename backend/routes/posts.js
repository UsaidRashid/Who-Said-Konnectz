const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const upload = require('../configs/multerConfig');

router.route("/new").post( upload.single('postPic') , postsController.createPost);

router.route("/fetch").get(postsController.fetchPosts);

router.route("/toggleLike").put(postsController.toggleLike);

router.route('/fetch-individual').post(postsController.fetchIndividualPosts);

router.route('/delete-post').post(postsController.deletePost);

module.exports = router;
