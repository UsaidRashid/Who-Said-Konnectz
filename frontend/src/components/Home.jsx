import { useNavigate  } from "react-router-dom";
import {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { setPosts } from "../store/Features/postSlice";
import { toggleLike } from "../store/Features/postSlice";

export default function Home(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const userId = useSelector(state => state.user.id);
    const posts = useSelector((state) => state.post.posts);

    async function logout() {
        try {
            const response = await axios.get('http://localhost:3002/logout');

            if (response.status === 200) {
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
        console.log(response.data.posts);
        dispatch(setPosts(response.data.posts.map((post) => ({
          _id: post._id,
          likes: post.likes,
          content: post.content,
          author: post.author.name,
        })))); 
        
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [dispatch]);

   async function newPost(){
        navigate('/newpost');        
   }

   const handleLike = async (post) => {
    try {
        const postId = post._id;
        const response = await axios.put(`http://localhost:3002/posts/toggleLike`,{userId,postId});
        if (response.status === 200) {
            //const updatedIsLiked = !post.isLiked;
            dispatch(toggleLike({ postId, userId }));
        } else {
            console.error('Error liking post:', response.data.message);
        }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    return(
        <div className="mx-72 mt-36">
            <button className="btn btn-danger" onClick={logout}>Log out</button>
            <button className="btn btn-primary" onClick={newPost}>Create a new Post!</button>
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
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
      {/* {console.log("updated posts ",posts)} */}
        </div>
    )
}