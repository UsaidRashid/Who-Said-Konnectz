const express=require("express");
const router=express.Router();
const postsController = require('../controllers/posts');
const {isLoggedIn} = require('../middleware');

router
    .route("/new")
        .post(  postsController.createPost);


router
    .route("/fetch")
        .get(postsController.fetchPosts);

router
    .route("/toggleLike")
        .put( postsController.toggleLike);


module.exports=router;