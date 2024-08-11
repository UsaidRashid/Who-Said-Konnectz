const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users");

router.route("/signup").post(userController.signUp);

router
  .route("/login")
  .post(passport.authenticate("local"), userController.login);

router.route("/logout").get(userController.logout);

router.route("/fetch-users").post(userController.fetchUsers);

router.route("/send-friend-request").post(userController.sendFriendRequest);

router.route("/fetch-friend-requests").post(userController.fetchFriendRequests);

router.route("/add-friend").post(userController.addFriend);

router.route("/fetch-friends").post(userController.fetchFriends);

router.route("/remove-friend").post(userController.removeFriend);

module.exports = router;
