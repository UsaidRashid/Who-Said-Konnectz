const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users");
const upload = require("../configs/multerConfig");

router
  .route("/signup")
  .post(upload.single("profilePic"), userController.signUp);

router
  .route("/login")
  .post(passport.authenticate("local"), userController.login);

router.route("/logout").get(userController.logout);

router
  .route("/update")
  .post(upload.single("profilePic"), userController.updateDetails);

router.route("/fetch-users").post(userController.fetchUsers);

router.route("/send-friend-request").post(userController.sendFriendRequest);

router.route("/fetch-friend-requests").post(userController.fetchFriendRequests);

router.route("/accept-friend-request").post(userController.acceptFriendRequest);

router.route("/reject-friend-request").post(userController.rejectFriendRequest);

router.route("/fetch-friends").post(userController.fetchFriends);

router.route("/remove-friend").post(userController.removeFriend);

router.route("/fetch-token").post(userController.fetchToken);

module.exports = router;
