import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";


export default function Login(){
    const [username, setUsername] = useState('');
    const [password,setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit =async (e)=>{
        e.preventDefault();
        try {
            const userData = { username, password };
            
            const response = await axios.post('http://localhost:3002/login',userData);
            
            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token',token);
                alert(response.data.message);
                navigate('/home');
                return response.data;
            } else {
                alert('Unexpected status code: ' + response.status);
            }
        } catch (error) {
            console.error('Error in Logging in:', error);
            alert(error.response.data.message);
            if (error.response) {
                alert('Error from server: ' + error.response.status + ' - ' + error.response.data.message);
            } else if (error.request) {
                alert('No response from the server');
            } else {
                alert('Error setting up the request: ' + error.message);
            }
        }
    }

    return(
        <div className="mt-36 mx-72">
            <form action="">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">@</span>
                    <input type="text" className="form-control" placeholder="Enter your username" aria-label="Username" aria-describedby="basic-addon1" value={username} onChange={(e)=>{setUsername(e.target.value)} }/>
                </div>
                <div className="input-group mb-3">
                    <input type="password" className="form-control" placeholder="Your password" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}