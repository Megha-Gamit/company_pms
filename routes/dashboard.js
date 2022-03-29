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

router.get("/", chechLoginUser, (req, res, next) => {

    // console.log("req.user",req.user);

    const loginUser = localStorage.getItem("loginUser");

   // return res.send({ loginUser: loginUser })

    res.render("dashboard", { title: "Password Management System", loginUser: loginUser, msg: "" });
});







module.exports = router;