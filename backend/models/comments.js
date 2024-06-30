const mongoose = require ("mongoose");

const commentSchema = new mongoose.Schema({
    content : {
        type: String,
        required : true,
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post',
        required: true,
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
});


commentSchema.methods.toggleLike = async function(userId){
    const liked = this.likes.includes(userId);
    if(liked){
        this.likes = this.likes.filter(id => id.toString() !== userId.toString());
    }else{
        this.likes.push(userId);
    }

    await this.save();
    return liked;
}


module.exports = mongoose.model("Comment",commentSchema);