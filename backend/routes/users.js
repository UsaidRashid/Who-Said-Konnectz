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

router.route("/add-friend").post(userController.addFriend);

router.route("/remove-friend").post(userController.removeFriend);

router.route("/fetch-friends").post(userController.fetchFriends);

module.exports = router;
