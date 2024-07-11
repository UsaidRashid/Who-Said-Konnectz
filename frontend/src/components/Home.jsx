import { useNavigate  } from "react-router-dom";
import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { setPosts } from "../store/Features/postSlice";
import { toggleLike ,toggleLikeComment } from "../store/Features/postSlice";
import {jwtDecode} from 'jwt-decode';


export default function Home(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const posts = useSelector((state) => state.post.posts);
    const storedToken = localStorage.getItem('token');

    let userId = null;
    if(storedToken){
      const decodedToken = jwtDecode(storedToken);

      if(!decodedToken.userId){
        alert('Token doesnt have userId');
        return;
      }
      userId = decodedToken.userId;
    
    }


    
    async function logout() {
        try {
            const response = await axios.get('http://localhost:3002/logout');

            if (response.status === 200) {
                localStorage.removeItem('token');
                alert(response.data.message);
                navigate('/');
            } else {
                alert('Unexpected status code: ' + response.status);
            }
        } catch (error) {
            console.error('Error logging out:', error);
            if (error.response) {
                alert('Error from server: ' + error.response.status + ' - ' + error.response.data.message);
            } else if (error.request) {
                alert('No response from the server');
            } else {
                alert('Error setting up the request: ' + error.message);
            }
        }
   }

   useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3002/posts/fetch');
        
        console.log(response.data.posts[1].comments[0].likes);
        dispatch(setPosts(response.data.posts.map((post) => ({
          ...post,
          isLiked: post.likes.includes(userId),
            _id: post._id,
          content: post.content,
          author: post.author.name,
          likes: post.likes,
            comments: post.comments.map((comment) => ({
              ...comment,
              isCommentLiked: comment.likes.includes(userId), 
            })),          
        }))));

        
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

   async function newPost(){
        navigate('/newpost');        
   }

   const handleCommentLike = async (comment,postId)=>{
      try {
        if(!userId){
          alert('You must be logged in');
          navigate('/login');
          return;
        }
        if(!comment){
          alert('Comment not found');
          return;
        }
        const commentId = comment._id;
        const response = await axios.post('http://localhost:3002/comments/toggleLike',{commentId,userId});
        if(response.status===401){
          alert('You must be Logged in!');
          navigate('/login');
        }
        console.log(commentId);
        if (response.status === 200) {
            dispatch(toggleLikeComment({ commentId, userId  ,postId }));
        } else {
            console.error('Error liking Comment:', response.data.message);
        }
      } catch (error) {
        console.log('Error occured while liking',error);  
      }
   }

   const handleLike = async (post) => {
    try {
      if(!userId){
        alert('You must be logged in');
        navigate('/login');
        return;
      }
      if(!post){
        alert('Post not found');
        return;
      }
        const postId = post._id;
        
        const response = await axios.put(`http://localhost:3002/posts/toggleLike`,{userId , postId});
        
        if(response.status===401){
          alert('You must be Logged in!');
          navigate('/login');
        }
        if (response.status === 200) {
            dispatch(toggleLike({ postId, userId }));
        } else {
            console.error('Error liking post:', response.data.message);
        }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    
    const handleAddComment = async (e,postId) =>{
      e.preventDefault();
      try {
        const content = e.target.elements[`commentText-${postId}`].value;
        console.log(content);
        const response = await axios.post('http://localhost:3002/comments/new',{postId,author:userId,content});

        if(response.status===200){
          alert('Comment created successfully');
        }else{
          console.error('Error Commenting on post:', response.data.message);
        }
      } catch (error) {
        console.error('Error commenting on post:', error);
      }
    };

  
    


    return(
        <div className="mx-72 mt-36">
            {localStorage.getItem('token')? <button className="btn btn-danger" onClick={logout}>Log out</button> : <button className="btn btn-success" onClick={()=>navigate('/login')} >Log in</button> }
            {localStorage.getItem('token')? <button className="btn btn-primary" onClick={newPost}>Create a new Post!</button>:'' }
            {posts && posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
            <strong>Author:</strong> {post.author} <br />
              <strong>Content:</strong> {post.content} <br />
              {post.likes.length} likes
              <button className="btn btn-primary" onClick={() => handleLike(post)}>
                {post.isLiked ? 'Unlike' : 'Like'}
              </button>
              
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#commentsModal-${post._id}`}>Comments</button>
              <div class="modal" tabindex="-1" id={`commentsModal-${post._id}`} >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Modal title</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <ul className="list-group">
                      
                    {post.comments.map((comment) => (
                      <li key={comment._id} className="list-group-item">

                        <strong>{comment.author.name}:</strong> {comment.content}
                        {comment.likes.length} likes
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleCommentLike(comment, post._id)} 
                              >
                                { comment.isCommentLiked? 'Unlike' : 'Like'}
                              </button>
                      </li>
                    ))}
              </ul>
              <form onSubmit={(e) => handleAddComment(e, post._id)}>
                  <div className="mb-3">
                    <label for={`commentText-${post._id}`} className="form-label">
                      Your comment
                    </label>
                    <textarea
                      className="form-control"
                      id={`commentText-${post._id}`}
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add Comment!
                  </button>
              
                </form>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
              <div>      
              </div>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}


            

        </div>
    )
}