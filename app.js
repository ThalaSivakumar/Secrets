//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const encrypt=require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/user1DB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})

const userSchema =new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt,{ secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});


app.post("/register",function(req,res){
  const userName=req.body.username;
     // User.findOne({email:userName},function(err,results){
     //   console.log(results);
     //   console.log(userName);
    // if(results.email!=userName){
    //   console.log(results);
    //   console.log(userName);
        const newUser =new User({
        email:req.body.username,
        password:req.body.password
      });
      newUser.save(function(err){
        if(err){
          res.send(err);
        }else{
          res.render("secrets");
        }
      });
  //   }else{
  //     res.send("User Exits already Try to login");
  //    }
  // });


});


app.post("/login",function(req,res){
userName=req.body.username;
password=req.body.password;
User.findOne({email:userName},function(err,foundUser){
  if(err){
    console.log(err);
  }else{
    if(foundUser){
      if(foundUser.password==password){
        res.render("secrets");
      }else{
        res.send("Oops Incorrect Password")
      }
    }else{
      res.send("User doesnt exists");
    }

  }
})

});



app.listen(3000, function() {
    console.log("Server started on port 3000.");
});
