const User =require("../models/users");
const jwt = require('jsonwebtoken');

module.exports.signUp = async (req,res) =>{
    console.log(req.body);
    let { name , email , password , contact , username } = req.body;

    if (!name || !email || !contact || !password || !username) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const existingUser = await User.findOne({email : email.toLowerCase()});

    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    const existingUsername = await User.findOne({username : username.toLowerCase()});

    if (existingUsername) {
        return res.status(400).json({ message: 'Username already in use' });
    }

    try {
        const newUser= new User({
            username,
            email,
            contact,
            name,
            password
        });

        const registeredUser=await User.register(newUser,req.body.password);

        req.login(registeredUser , (err) =>{
            if(err){
                console.log(err);
                
                return res.status(400).json({ message: 'Error saving the user' });
            }
            else{
                const token = jwt.sign({ userId : registeredUser._id }, 'secretkey', { algorithm: 'HS256' });
                
                return res.status(200).json({ message: 'User created successfully', userData: registeredUser , token });
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Error registering user' });
    }
}

module.exports.login =async (req,res) => {
    try {
        
        console.log(req.body);
        
        const user = await User.find({username:req.body.username});  
        console.log(user);

        if (Object.keys( user).length===0) {
            return res.status(401).json({ message: 'Invalid User' });
        }

  
        if(req.body.password != user[0].password) return res.status(401).json({ message: 'Invalid username or password' });
  
        const payload = { userId: user[0]._id }; 
        const token = jwt.sign(payload, 'secretkey' , { expiresIn: '1h' });
        
        return res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Error extracting user information' });
    }
    
}

module.exports.logout = (req,res) => {
    req.logout( (err) =>{
        if(err){
            console.error(err);
            return res.status(400).json({ message: 'Error logging out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
}