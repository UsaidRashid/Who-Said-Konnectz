import {useDispatch , useSelector} from "react-redux"
import {setPassword, setUsername , setContact , setEmail , setName , setId} from "../store/Features/userSlice"
import axios from "axios"
import { useNavigate } from "react-router-dom";

export default function Login(){
    const dispatch = useDispatch();
    const {username , password} = useSelector((state)=>state.user);
    const navigate = useNavigate();

    const handleSubmit =async (e)=>{
        e.preventDefault();
        try {
            const userData = { username, password };
            const response = await axios.post('http://localhost:3002/login',userData);
            console.log(response.data.user[0]);
        
            if (response.status === 200) {
                const userData = response.data.user[0];
                dispatch(setUsername(userData.username));
                dispatch(setEmail(userData.email));  
                dispatch(setName(userData.name));    
                dispatch(setContact(userData.contact));
                dispatch(setPassword(userData.password));
                dispatch(setId(userData._id));
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
                    <input type="text" className="form-control" placeholder="Enter your username" aria-label="Username" aria-describedby="basic-addon1" value={username} onChange={(e)=>{dispatch(setUsername(e.target.value))} }/>
                </div>
                <div className="input-group mb-3">
                    <input type="password" className="form-control" placeholder="Your password" value={password} onChange={(e)=>{dispatch(setPassword(e.target.value))}} />
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