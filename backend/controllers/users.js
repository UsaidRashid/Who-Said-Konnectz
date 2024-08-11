const User = require("../models/users");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
  let { name, email, password, contact, username } = req.body;

  if (!name || !email || !contact || !password || !username) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const existingUsername = await User.findOne({
    username: username.toLowerCase(),
  });

  if (existingUsername) {
    return res.status(400).json({ message: "Username already in use" });
  }

  try {
    const newUser = new User({
      username,
      email,
      contact,
      name,
    });

    const registeredUser = await User.register(newUser, req.body.password);

    req.login(registeredUser, (err) => {
      if (err) {
        console.log(err);

        return res.status(400).json({ message: "Error saving the user" });
      } else {
        const token = jwt.sign({ user: registeredUser }, "secretkey", {
          algorithm: "HS256",
        });

        return res.status(200).json({
          message: "User created successfully",
          userData: registeredUser,
          token,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error registering user" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate(
      "friends"
    );

    const payload = { user: user };
    const token = jwt.sign(payload, "secretkey", { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error extracting user information" });
  }
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

module.exports.fetchUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("friends");
    return res
      .status(200)
      .json({ message: "Users fetched Successfully", users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.sendFriendRequest = async (req, res) => {
  try {
    const { toId, fromId } = req.body;
    const user1 = await User.findOne({ _id: toId });
    const user2 = await User.findOne({ _id: fromId });
    user1.requests.push(user2);
    await user1.save();
    return res
      .status(200)
      .json({ message: "Friend Request Sent Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.fetchFriendRequests = async (req, res) => {
  try {
    const { _id } = req.body;
    const requests = await User.findOne({ _id }).populate("requests");
    return res
      .status(200)
      .json({ message: "Friend Requests Fetched Successfully", requests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.addFriend = async (req, res) => {
  try {
    const { toId, fromId } = req.body;
    const user1 = await User.findOne({ _id: toId }).populate("friends");
    const user2 = await User.findOne({ _id: fromId }).populate("friends");
    user1.friends.push(user2);
    user2.friends.push(user1);
    await user1.save();
    await user2.save();
    const token = jwt.sign({ user: user2 }, "secretkey", {
      algorithm: "HS256",
    });
    return res
      .status(200)
      .json({ message: "Friend Added Successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.removeFriend = async (req, res) => {
  try {
    const { toId, fromId } = req.body;
    const user1 = await User.findOne({ _id: toId }).populate("friends");
    const user2 = await User.findOne({ _id: fromId }).populate("friends");
    user1.friends = user1.friends.filter(
      (friend) => friend._id.toString() !== fromId
    );
    user2.friends = user2.friends.filter(
      (friend) => friend._id.toString() !== toId
    );
    await user1.save();
    await user2.save();
    const token = jwt.sign({ user: user2 }, "secretkey", {
      algorithm: "HS256",
    });
    return res
      .status(200)
      .json({ message: "Friend Added Successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.fetchFriends = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findOne({ _id }).populate("friends");
    if (!user)
      return res.status(400).json({ message: "You must be logged in..." });
    return res
      .status(200)
      .json({ message: "Friends Fetched Successfully", users: user.friends });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
