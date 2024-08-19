const Post = require("../models/posts");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

module.exports.createPost = async (req, res) => {
  const { content, token } = req.body;

  const postPic = req.file ? req.file.path : null;

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const authorDB = await User.find({ _id: decodedToken.user._id });

  const authorId = authorDB[0]._id;

  try {
    const newPost = new Post({ author: authorId, content, postPic });

    if (postPic) {
      const cloudinaryUrl = cloudinary.url(postPic, {
        secure: true,
      });
      newPost.postPic = cloudinaryUrl;
    }

    await newPost.save();

    return res
      .status(200)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.toggleLike = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    let unliked = await post.toggleLike(userId);

    await post.save();

    res.status(200).json({
      message: unliked ? "Unliked Successfully" : "Liked Successfully",
      userId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.fetchPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      });

    const totalPosts = await Post.countDocuments({});
    const hasMore = page * limit < totalPosts;

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.fetchIndividualPosts = async (req, res) => {
  try {
    const { _id } = req.body;
    const posts = await Post.find({})
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      });

    const individualPosts = posts.filter(
      (post) => post.author._id.toString() === _id
    );

    return res
      .status(200)
      .json({ message: "Posts fetched successfully", posts: individualPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { _id } = req.body;
    await Post.deleteOne({ _id });
    return res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    console.error("Error Deleting Post", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
