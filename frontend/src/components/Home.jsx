import { useNavigate  } from "react-router-dom";
import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { setPosts } from "../store/Features/postSlice";
import { toggleLike } from "../store/Features/postSlice";
import {jwtDecode} from 'jwt-decode';


export default function Home(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const posts = useSelector((state) => state.post.posts);
    const storedToken = localStorage.getItem('token');

    if(!storedToken){
      alert('Token Not found');
      return;
    }

    const decodedToken = jwtDecode(storedToken);

    if(!decodedToken.userId){
      alert('Token doesnt have userId');
      return;
    }

    const userId = decodedToken.userId;
    
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

        dispatch(setPosts(response.data.posts.map((post) => ({
          _id: post._id,
          content: post.content,
          author: post.author.name,
          likes: post.likes,
          isLiked : post.likes.includes(userId),
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

   const handleLike = async (post) => {
    try {
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
        </div>
    )
}