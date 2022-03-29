const express = require("express");
const router = express.Router();
const userModel = require("../modules/users");
const passcatModel = require("../modules/password_category");
const passModel = require("../modules/add_password");
let bcrypt = require("bcryptjs");
let jwt = require('jsonwebtoken');
const { decode } = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const ObjectId = require("mongodb").ObjectID;



//Get Home Page


// var LocalStorage = require('node-localstorage').LocalStorage
// localStorage = new LocalStorage('./scratch');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

function chechLoginUser(req, res, next) {
  //  console.log(" i am in...");
    let userToken = localStorage.getItem('userToken');

    try {

        const decoded = jwt.verify(userToken, 'loginToken');
        // req.user = decoded
       // console.log(">>>", userToken, "----", decoded);

        next()

    } catch (err) {
        res.redirect("/");
    }
}

function checkemail(req, res, next) {
    const email = req.body.email;
    const checkexitemail = userModel.findOne({ email: email })
    checkexitemail.exec((err, data) => {
        if (err) throw err;

        if (data) {

            return res.render("signup", { title: "Password Management System", msg: "Email Already Exit" });

        }

        next();

    })

}


function checkusername(req, res, next) {
    const uname = req.body.uname;
    const checkexitemail = userModel.findOne({ username: uname })
    checkexitemail.exec((err, data) => {
        if (err) throw err;

        if (data) {

            return res.render("signup", { title: "Password Management System", msg: "User Name Already Exit" });

        }

        next();

    })

}


router.get("/", chechLoginUser, (req, res) => {

    res.redirect("/dashboard");
  
  });
 
  router.get("/edit/:id", chechLoginUser, (req, res) => {
 
     const loginUser = localStorage.getItem("loginUser");
     const id = req.params.id;
 
     const getPassCat = passcatModel.find({});
   
 
     const getPassDetails = passModel.findById({_id: new ObjectId(id)});
     getPassDetails.exec((err,data)=>{
 
         if(err) throw err;
         getPassCat.exec((err,data1)=>{
             //console.log(data);
            // console.log(data1);
 
         res.render("edit_password_details", { title: "Password Management System", loginUser: loginUser, record:data, records:data1,success:""});
         });
 
     });
  });
 
 
  router.post("/edit/:id", chechLoginUser, (req, res) => {
 
     const loginUser = localStorage.getItem("loginUser");
     const id = req.params.id;
     const pass_cat= req.body.pass_cat;
     const project_name = req.body.project_name;
     const pass_detail = req.body.pass_detail;
 
     passModel.findByIdAndUpdate(id,{
         Password_category:pass_cat,
         project_name: project_name,
         Password_detail:pass_detail
     }).exec((err)=>{
 
         if(err) throw err;
         
         const getPassCat = passcatModel.find({});
   
 
     const getPassDetails = passModel.findById({_id: new ObjectId(id)});
     getPassDetails.exec((err,data)=>{
 
         if(err) throw err;
         getPassCat.exec((err,data1)=>{
             //console.log(data);
            // console.log(data1);
 
            res.redirect("/view-all-password");
 
 
       //  res.render("view-all-password", { title: "Password Management System", loginUser: loginUser, record:data, records:data1,success:"Password Updated Successfully"});
         });
 
     });
     })
 
     
  });
 
 
  router.get("/delete/:id", chechLoginUser, (req, res) => {
 
     const loginUser = localStorage.getItem("loginUser");
 
     const id = req.params.id;
    
     const passdelete = passModel.findByIdAndDelete(id);
 
 
     passdelete.exec((err) => {
 
         if (err) throw err;
 
         res.redirect("/view-all-password");
 
     })
 
 
 });
 
 

module.exports = router;