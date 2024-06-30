const express =require('express');
const app=express();
const port=3002;
const cors= require('cors');


const mongoose=require('mongoose');
const mongoUrl = "mongodb://127.0.0.1:27017/Who-Said-Konnectz";

main().then(()=>{
    console.log("Successfully connected to Who-Said Konnectz Database");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongoUrl);
}

const User = require('./models/users');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const session=require("express-session");
const passport=require("passport");
const localStrategy = require("passport-local").Strategy;

const sessionOptions = {
    secret : "supersecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
    }
}

app.use(session(sessionOptions));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());



app.use((err, req, res, next) => {
    console.error(err); 
  
    if (err.status) {
      res.status(err.status).json({ message: err.message }); 
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
});

const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');

app.use("/",userRouter);
app.use("/posts/",postRouter);

app.get("/", (req,res,next)=>{
    res.send("It's the backend of Who-Said Konnectz!");
})

app.listen(port,()=>{
    console.log(`Who-Said Konnectz running on port ${port}`);
})