import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


export default function NewPost(){
    const navigate= useNavigate();
    const [postText, setPostText] = useState("");
    
    async function createPost(){
        try {
            const content = postText;
            const storedToken = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3002/posts/new',{content,token:storedToken});

            if(response.status===401){
                alert('You must be Logged in!');
                navigate('/login');
              }
            
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/home');
                return response.data;
            } else {
                alert('Unexpected status code: ' + response.status);
            }

        } catch (error) {
            console.error('Error in creating a new post:', error);
            if (error.response) {
                alert('Error from server: ' + error.response.status + ' - ' + error.response.data.message);
            } else if (error.request) {
                alert('No response from the server');
            } else {
                alert('Error setting up the request: ' + error.message);
            }
        }
    }

    function handlePostTextChange(event){
        setPostText(event.target.value);
    }

    return(
        <div>
            <div className="mt-52 mx-72">
                <label for="exampleFormControlTextarea1" className="form-label text-emerald-900">Cook Something Great...</label>
                <textarea className="form-control mb-3" id="exampleFormControlTextarea1" rows="10" value={postText} onChange={handlePostTextChange} placeholder="What's on your mind?"></textarea>
                <button className="btn btn-success float-right" onClick={createPost}>Create Post</button>
            </div>
        </div>
    )
};