const express = require("express");
const router = express.Router();
const userModel= require("../modules/users")
let bcrypt = require("bcryptjs");
let jwt = require('jsonwebtoken'); 
const { decode } = require("jsonwebtoken");
  
//Get Home Page


// var LocalStorage = require('node-localstorage').LocalStorage
// localStorage = new LocalStorage('./scratch');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

function chechLoginUser(req,res,next){
    let userToken = localStorage.getItem('userToken');
  
    try{
        
        const decoded = jwt.verify(userToken,'loginToken');
       // req.user = decoded

        next()

    }catch(err){
       res.redirect("/");
    }
}

function checkemail(req,res,next){
    const email = req.body.email;
    const checkexitemail = userModel.findOne({email:email})
    checkexitemail.exec((err,data)=>{
        if(err) throw err;

        if(data){

          return  res.render("signup",{title:"Password Management System", msg:"Email Already Exit"});

        }

        next();

    })

}


function checkusername(req,res,next){
    const uname = req.body.uname;
    const checkexitemail = userModel.findOne({username:uname})
    checkexitemail.exec((err,data)=>{
        if(err) throw err;

        if(data){

          return  res.render("signup",{title:"Password Management System", msg:"User Name Already Exit"});

        }

        next();

    })

}

router.get("/",(req,res,next)=>{
    res.render("index",{title:"Password Management System",msg:""});
});

router.post("/",(req,res,next)=>{
    
    const username = req.body.uname;
    const password = req.body.password;
    const checkUser =userModel.findOne({username:username});
    checkUser.exec((err,data)=>{
        if(err) throw err;
        const getUserID = data._id;
        const getPassword = data.password;
        console.log("----------",bcrypt.compareSync(password,getPassword))
        if(bcrypt.compareSync(password,getPassword)){

            const token = jwt.sign({userID:getUserID},'loginToken');
            console.log(token);
            localStorage.setItem("userToken",token);
            localStorage.setItem('loginUser',username);

           res.redirect("/dashboard");
        }else{
            res.render("index",{title:"Password Management System",msg:"Invalid Username and Password"});
        }
    })
   
});

router.get("/dashboard", chechLoginUser, (req,res,next)=>{

   // console.log("req.user",req.user);

    const loginUser = localStorage.getItem("loginUser");
   
    res.render("dashboard",{title:"Password Management System", loginUser:loginUser, msg:""});
});



router.get("/signup",(req,res)=>{
    res.render("signup",{title:"Password Management System", msg:""});
});

router.post("/signup", checkusername,checkemail, (req,res)=>{

    const username = req.body.uname;
    const email = req.body.email;
    let password = req.body.password;
    const confpassword= req.body.confpassword;

    if(password != confpassword){


        res.render("signup",{title:"Password Management System", msg:"Password Not Match"});

        
    }else{

    password = bcrypt.hashSync(req.body.password,10);

    const userdetails = new userModel({
        username:username,
        email:email,
        password:password
    
    })

    userdetails.save((err,doc)=>{
        if(err) throw err;


        res.render("signup",{title:"Password Management System", msg:"User Registerd Successfully"});

    });
     }


});

router.get("/passwordCategory", chechLoginUser, (req,res)=>{
   
  
    res.render("password_category",{title:"Password Management System"});
});

router.get("/add-new-category", chechLoginUser, (req,res)=>{
    res.render("addNewCategory",{title:"Password Management System"});
});

router.get("/add-new-passwod",  chechLoginUser, (req,res)=>{
    res.render("add-new-password",{title:"Password Management System"});
});

router.get("/view-all-passwod",(req,res)=>{
    res.render("view-all-password",{title:"Password Management System"});
});

router.get("/logout",(req,res)=>{
    localStorage.removeItem("userToken");
    localStorage.removeItem('loginUser');
    res.redirect("/");
});



module.exports= router;