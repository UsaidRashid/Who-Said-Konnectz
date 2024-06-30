const mongoose = require("mongoose");

const postSchema= new mongoose.Schema({
    content : {
        type : String,
        required: true,
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true,
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
});


postSchema.methods.toggleLike = async function(userId){
    const liked = this.likes.includes(userId);
    if(liked){
        this.likes.pull(userId);
    }else{
        this.likes.push(userId);
    }

    await this.save();
    return !liked;
}


module.exports = mongoose.model("Post",postSchema);