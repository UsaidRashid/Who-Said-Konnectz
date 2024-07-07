import {useDispatch , useSelector} from "react-redux"
import {setContact , setEmail , setName , setPassword, setUsername , setId} from "../store/Features/userSlice"
import axios from "axios"
import {Link, useNavigate } from "react-router-dom";

export default function SignUp(){
    const dispatch = useDispatch();
    const {username , email , name , contact ,password, id} = useSelector((state)=>state.user);
    const navigate = useNavigate();

    const handleSubmit =async (e)=>{
        e.preventDefault();
        try {
            const userData = { username, email, name, contact, password };
            const response = await axios.post('http://localhost:3002/signup',userData);
            console.log(response.data);
        
            if (response.status === 200) {
                alert(response.data.message);
                const token = response.data.token;
                localStorage.setItem('token',token);
                dispatch(setId(response.data.userData._id));
                navigate('/home');
                return response.data;
            } else {
                alert('Unexpected status code: ' + response.status);
            }
        } catch (error) {
            console.error('Error in Signing up:', error);
            if (error.response) {
                alert('Error from server: ' + error.response.status + ' - ' + error.response.data.message);
            } else if (error.request) {
                alert('No response from the server');
            } else {
                alert('Error setting up the request: ' + error.message);
            }
        }
    }

    return (
        <div className="">
        <div className="mt-36 mx-72">
            <form action="">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">@</span>
                    <input type="text" className="form-control" placeholder="Enter a unique username" aria-label="Username" aria-describedby="basic-addon1" value={username} onChange={(e)=>{dispatch(setUsername(e.target.value))} }/>
                </div>

                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Enter your email" aria-label="Recipient's username" aria-describedby="basic-addon2" value={email} onChange={(e)=>{dispatch(setEmail(e.target.value))}}/>
                    <span className="input-group-text" id="basic-addon2">example@gmail.com</span>
                </div>

                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Your Name goes here..." value={name} onChange={(e)=>{dispatch(setName(e.target.value))}}/>
                </div>

                <div className="input-group mb-3">
                    <input type="number" className="form-control" placeholder="Your contact Number" value={contact} onChange={(e)=>{dispatch(setContact(e.target.value))}} />
                </div>

                <div className="input-group mb-3">
                    <input type="password" className="form-control" placeholder="Cook some strong password" value={password} onChange={(e)=>{dispatch(setPassword(e.target.value))}} />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary mb-3" onClick={handleSubmit}>
                        Sign Up
                    </button>
                </div>
                <p className="flex justify-end">Already Have an account? &nbsp; <Link to='/' className='underline text-green'>Login</Link>&nbsp;here</p>
            </form>
        </div>
        </div>
    );
}