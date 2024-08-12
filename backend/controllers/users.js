const User = require("../models/users");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

module.exports.signUp = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  let { name, email, password, contact, username } = req.body;
  const profilePic = req.file ? req.file.path : null;

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
      profilePic,
    });
    const registeredUser = await User.register(newUser, req.body.password);

    if (profilePic) {
      const cloudinaryUrl = cloudinary.url(profilePic, {
        secure: true,
      });
      registeredUser.profilePic = cloudinaryUrl;
    }

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
    const user = await User.findOne({ username: req.body.username })
      .populate("friends")
      .populate("requestsRecieved")
      .populate("requestsSent");

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

module.exports.updateDetails = async (req, res) => {
  try {
    const { name, email, contact, token } = req.body;
    const profilePic = req.file ? req.file.filename : null;

    if (!name || !email)
      return res
        .status(400)
        .json({ message: "Required Fields shouldn't be ignored!" });

    if (!token)
      return res
        .status(400)
        .json({ message: "Something went wrong! Are you logged in?" });

    const decodedToken = jwt.verify(token, "secretkey");

    const username = decodedToken.user.username;

    const updatedProfile = {
      name,
      email,
      contact,
      profilePic,
    };

    if (profilePic) {
      const cloudinaryUrl = cloudinary.url(profilePic, {
        secure: true,
      });
      updatedProfile.profilePic = cloudinaryUrl;
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      updatedProfile,
      { new: true, runValidators: true }
    )
      .populate("friends")
      .populate("requestsSent")
      .populate("requestsRecieved");

    const newToken = jwt.sign({ user: updatedUser }, 'secretkey', {
      algorithm: "HS256",
    });

    if (!updatedUser)
      return res.status(400).json({
        message: "Couldn't find user profile ! Please try logging in again",
      });

    return res
      .status(200)
      .json({ message: "User Updated successfully", token: newToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
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
    const user1 = await User.findOne({ _id: toId })
      .populate("friends")
      .populate("requestsSent")
      .populate("requestsRecieved");
    const user2 = await User.findOne({ _id: fromId })
      .populate("friends")
      .populate("requestsSent")
      .populate("requestsRecieved");
    user1.requestsRecieved.push(user2);
    user2.requestsSent.push(user1);
    await user1.save();
    await user2.save();
    const token = jwt.sign({ user: user2 }, "secretkey", {
      algorithm: "HS256",
    });
    return res
      .status(200)
      .json({ message: "Friend Request Sent Successfully!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.fetchFriendRequests = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findOne({ _id }).populate("requestsRecieved");
    const requests = user.requestsRecieved;
    return res
      .status(200)
      .json({ message: "Friend Requests Fetched Successfully", requests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.acceptFriendRequest = async (req, res) => {
  try {
    console.log(req.body);
    const { toId, fromId } = req.body;
    const user1 = await User.findOne({ _id: toId })
      .populate("requestsRecieved")
      .populate("requestsSent")
      .populate("friends");
    const user2 = await User.findOne({ _id: fromId }).populate("requestsSent");
    user1.requestsRecieved.pull(fromId);
    user2.requestsSent.pull(toId);
    user1.friends.push(user2);
    user2.friends.push(user1);
    await user1.save();
    await user2.save();
    const token = jwt.sign({ user: user1 }, "secretkey", {
      algorithm: "HS256",
    });
    return res
      .status(200)
      .json({ message: "Friend Request Accepted Successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error".error });
  }
};

module.exports.rejectFriendRequest = async (req, res) => {
  try {
    const { toId, fromId } = req.body;
    const user1 = await User.findOne({ _id: toId }).populate(
      "requestsRecieved"
    );
    const user2 = await User.findOne({ _id: fromId }).populate("requestsSent");
    user1.requestsRecieved.pull(fromId);
    user2.requestsSent.pull(toId);
    await user1.save();
    await user2.save();
    const token = jwt.sign({ user: user1 }, "secretkey", {
      algorithm: "HS256",
    });
    return res
      .status(200)
      .json({ message: "Friend Request Rejected Successfully", token });
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

module.exports.fetchToken = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findOne({ _id })
      .populate("requestsRecieved")
      .populate("requestsSent")
      .populate("friends");
    const token = jwt.sign({ user: user }, "secretkey", {
      algorithm: "HS256",
    });
    return res
      .status(200)
      .json({ message: "Token Fetched Successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
