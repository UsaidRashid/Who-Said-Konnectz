const Comment = require("../models/comments");
const Post = require("../models/posts");

module.exports.createComment = async (req , res) => {
    const { postId , content , author } = req.body;

    try {
        const post = await Post.findById(postId).populate({
            path: 'comments',
            populate:{
                path:'author',
                select:'name',
            }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
    
        const newComment = new Comment({ content, author, post: postId });
        await newComment.save();
        
        post.comments.push(newComment);
        
        await post.save();
        console.log(post);
        res.status(200).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : "Internal Server Error"});
    }
}


module.exports.toggleLike = async (req,res) =>{
    const { commentId , userId } =req.body;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        let unliked = await comment.toggleLike(userId);
        const likesCount = comment.likes.length;

        res.status(200).json({ message : unliked? "Unliked Successfully" : "Liked Successfully" , likesCount});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : "Internal Server Error"});
    }
}