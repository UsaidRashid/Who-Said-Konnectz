const Post = require ("../models/posts");
const User = require("../models/users");
const jwt = require('jsonwebtoken');


module.exports.createPost = async (req,res) => {
    
    const { content ,token } =req.body;
    console.log(req.body);

    const decodedToken =jwt.verify(token, "secretkey");
    
    const authorDB =await User.find({_id:decodedToken.userId});
    
    const authorId = authorDB[0]._id;

    try {
        const newPost = new Post({author: authorId , content});

        await newPost.save();

        return res.status(200).json({message : "Post created successfully" , post : newPost});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports.toggleLike = async (req,res) => {
    const { postId , userId } =req.body;
    

    console.log(postId);
    console.log(userId);
    

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        let unliked = await post.toggleLike(userId);

        await post.save();
        console.log(post);

        res.status(200).json({ message : unliked? "Unliked Successfully" : "Liked Successfully" , userId});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports.fetchPosts = async (req,res) =>{
    try {
        const posts = await Post.find({}).populate('author', 'name');;
        console.log("Fetch posts from Db ", posts);
        return res.status(200).json({message:"Posts fetched successfully", posts});
    } catch (error) {
        console.error("Error fetching posts:",error);
        return res.status(500).json({message : "Internal Server Error"});
    }
}