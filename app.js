require('dotenv').config();
const express=require('express');
const bodyparser=require('body-parser');
const ejs=require('ejs');
const _=require('lodash');
const mongoose = require('mongoose');
const encrypt=require('mongoose-encryption');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;GoogleStrategy = require('passport-google-oauth20').Strategy;

mongoose.connect('mongodb://localhost:27017/PostDB',{useNewUrlParser:true});

const Postschema=new mongoose.Schema({
    title:String,
    text:String,
});

const UserSchema=new mongoose.Schema({
    email:String,
    password:String,
    title:String,
})

UserSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const app=express();

const text=",hbjsdj,hbsc<JHBcf,ns c,jbhv,svjab,bk,Uhv mdnf.kjgh.s g.skbjn/ o/arepognek,rajbkuhfd.kn,ds .vijjr, v";
var curruser=false;
var currloguser="";

const Post=mongoose.model("post",Postschema);
const User=mongoose.model("user",UserSchema);

app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

app.get("/",(req,res)=>
{
    Post.find({}) 
    .then((posts) => {
        // Success callback

        if(!curruser)
        {
            res.render("home",{mess:text,obj:posts});
            // res.sendFile(__dirname+"/home",{mess:text,obj:posts})
        }
        else
        {
            res.render("newhome",{mess:text,obj:posts,loginuser:currloguser});
        }
        
    })
    .catch((error) => {
        // Error callback
        console.error(error);
    });
})

app.get("/contact",(req,res)=>
{
    res.render("contact",{mess:text})
})

app.get("/about",(req,res)=>
{
    res.render("about",{mess:text})
})

app.get("/compose",(req,res)=>
{
    res.render("compose")
})

app.get("/updatepost",(req,res)=>
{
    res.render("updatepost")
})

app.get("/logout",(req,res)=>
{
    curruser=false;
    currloguser="";
    res.redirect("/");
})

app.get("/login",(req,res)=>
{
    res.render("login");
})

app.get("/register",(req,res)=>
{
    res.render("register")
})

app.get("/errregister",(req,res)=>
{
    res.render("errregister")
})

app.get("/errlogin",(req,res)=>
{
    res.render("errlogin")
})

app.get("/notcreated",(req,res)=>
{
    res.render("notcreated")
})


app.post("/compose",(req,res)=>
{
    // console.log(req.body.text);

    const post_data= new Post({
        title:req.body.title,
        text:req.body.text
    });

    const tit=req.body.title;
    let x=0;

    // async function readData() {
    //     try {
    //       // Retrieve all documents from the "Person" collection
    //       const post = await Post.find();
            
    //       for(let i=0;i<post.length;i++)
    //       {
    //           if(post[i].title===tit)
    //           {
    //               x=1;
    //           }
    //       } 

    //       if(x===0)
    //       {
    //         post_data.save();
    //       }

    //     } catch (error) {
    //       console.error(error);
    //     } finally {
    //     }
    //   }

    //   readData();
      

    Post.find({}) 
    .then((post) => {
        for(let i=0;i<post.length;i++)
          {
              if(post[i].title===tit)
              {
                  x=1;
              }
          } 

          if(x===0)
          {
            post_data.save();
          }      
    })
    .catch((error) => {
        // Error callback
        console.error(error);
    });

    res.redirect("/");

    // console.log(data);
})

app.get("/posts/:abc",(req,res)=>
{
    // console.log(req.params.abc);
    const x=_.lowerCase(req.params.abc);

    Post.find({}) 
    .then((post) => {
        for(var i=0;i<post.length;i++)
        {
            if(x===_.lowerCase(post[i].title))
            {
                res.render("posts",{title_of_post:post[i].title,text_of_post:post[i].text,loginuser:currloguser});
            }
        } 
    })
    .catch((error) => {
        // Error callback
        console.error(error);
    });
})

app.get("/viewpost",(req,res)=>
{
    Post.find({}) 
    .then((posts) => {
        // Success callback
        
        res.render("viewpost",{mess:text,obj:posts});
    })
    .catch((error) => {
        // Error callback
        console.error(error);
    });
})

app.post("/delete",(req,res)=>
{
    // console.log(req.body.title);
    const del_title=req.body.title;

    Post.deleteOne({ title:del_title })
    .then((result) => {
        res.redirect("/");
    })
    .catch((error) => {
        console.error('Error deleting document:');
    });
})

app.post("/update",(req,res)=>
{
    // console.log(req.body.title);
    const del_title=req.body.title;

    Post.deleteOne({ title:del_title })
    .then((result) => {
        res.redirect("/");
    })
    .catch((error) => {
        console.error('Error deleting document:');
    });

    res.render("updatepost",{title:del_title});
})

app.post("/register",(req,res)=>
{
    const email1=req.body.username;
    const password1=req.body.password;
    const username1=req.body.title;

    let x=0;

    User.find({}) 
    .then((users) => {

        for(var i=0;i<users.length;i++)
        {
            if(email1===users[i].email)
            {
                x=1;
            }
        }

        if(x===1)
        {
            res.redirect("/errregister");
        }
        else
        {
            curruser=true;
            currloguser=email1;

            const user1=new User({
                email:email1,
                password:password1,
                username:username1
            });

            user1.save();
            currloguser=username1;

            res.redirect("/");
        }
    })
    .catch((error) => {
        // Error callback
        console.error(error);
    });
})

app.post("/login",(req,res)=>
{
    const email1=req.body.username;
    const password1=req.body.password;
    const username1=req.body.title;

    User.find({}) 
    .then((users) => {

        for(var i=0;i<users.length;i++)
        {
            if((email1===users[i].email&&password1===users[i].password))
            {
                curruser=true;
                currloguser=username1;
                res.redirect("/");
            }
        }

        res.redirect("/errlogin");
    })
    .catch((error) => {
        // Error callback
        console.error(error);
    });


})

app.post("/viewyourpost",(req,res)=>
{
    const x=_.lowerCase(currloguser);

    Post.find({}) 
    .then((post) => {
        for(var i=0;i<post.length;i++)
        {
            if(x===_.lowerCase(post[i].title))
            {
                res.render("posts",{title_of_post:post[i].title,text_of_post:post[i].text,loginuser:currloguser});
            }
        }

        res.redirect("/notcreated");
    })
    .catch((error) => {
        // Error callback
        console.error(error);
    });
})

app.listen(process.env.PORT || 5000,()=>
{
    console.log("Hey your server get started");
})

