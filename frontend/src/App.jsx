import './App.css'
import {Route, BrowserRouter , Router ,Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import { Provider } from 'react-redux';
import store from "./store/store";
import Login from './components/Login';
import Home from './components/Home';
import NewPost from './components/NewPost';
import ChatBox from './components/Chatbox';

function App() {

  return (
      <Provider store={store}>
      <Header />

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path='/newpost' element={<NewPost/>}/>
          <Route path='/chatbox' element={<ChatBox/>}></Route>
        </Routes>
      </BrowserRouter>

      <Footer />
    </Provider>
  )
}

export default App
