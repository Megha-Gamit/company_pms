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

    const loginUser = localStorage.getItem("loginUser");
    const getPassCat = passcatModel.find({});
    getPassCat.exec((err,data)=>{
        if(err) throw err;

        res.render("add-new-password", { title: "Password Management System", loginUser: loginUser, records:data, success: ''});

    })
  
});

router.post("/", chechLoginUser, async (req, res) => {

    const loginUser = localStorage.getItem("loginUser");

    const pass_cat = req.body.pass_cat;
   const  project_name= req.body.project_name;
    const pass_detail = req.body.pass_detail;

   const  password_details = new passModel({
        Password_category: pass_cat,
        project_name:project_name,
        Password_detail:pass_detail
    })


     const getSaveData = await password_details.save();

     console.log("getSaveData", getSaveData);

     const getPassCat = await passcatModel.find({});
     console.log("getPassCat", getPassCat);


    res.render("add-new-password", { title: "Password Management System", loginUser: loginUser,records:getPassCat, success:"Password Details Inserted Successfully"});


    // password_details.save((err,doc)=>{

    //     getPassCat.exec((err,data)=>{
    //         if(err) throw err;
    //      console.log(data)
    //      res.render("add-new-password", { title: "Password Management System", loginUser: loginUser,records:data, success:"Password Details Inserted Successfully"});

        
    //     })
    // })


});





module.exports = router;