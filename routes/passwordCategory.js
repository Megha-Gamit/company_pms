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

    const getPassCat = passcatModel.find();

    getPassCat.exec((err, data) => {

        if (err) throw err;

        res.render("password_category", { title: "Password Management System", loginUser: loginUser, records: data });

    })


});



router.get("/delete/:id", chechLoginUser, (req, res) => {

    const loginUser = localStorage.getItem("loginUser");

    const passcat_id = req.params.id;
    console.log(passcat_id);

    const passdelete = passcatModel.findByIdAndDelete(passcat_id);


    passdelete.exec((err) => {

        if (err) throw err;

        res.redirect("/passwordCategory");

    })


});



router.get("/edit/:id", chechLoginUser, (req, res) => {

    const loginUser = localStorage.getItem("loginUser");

    const passcat_id = req.params.id;
    console.log(passcat_id);

    const getPassCat = passcatModel.findById(passcat_id);


    getPassCat.exec((err, data) => {

        if (err) throw err;

        res.render("edit_pass_category", { title: "Password Management System", loginUser: loginUser, errors: '', success: '', records: data, id: passcat_id });

    })


});



router.post("/edit/", chechLoginUser, async (req, res) => {

    const loginUser = localStorage.getItem("loginUser");

    //const passcat_id= req.body.id;
    // console.log(passcat_id);
    // const passwordCategory= req.body.passwordCategory;

    // let update_passcat = passcatModel .findByIdAndUpdate(req.body.id,{
    //     Password_category:req.body.passwordCategory
    // });


    // update_passcat.exec((err,doc)=>{

    //     if(err) throw err;

    //     res.redirect("/passwordCategory");
    // })  



   // console.log("==", req.body.id);

    const update_category = await passcatModel.updateOne({ _id: ObjectId(req.body.id) }, {
        $set: { Password_category: req.body.passwordCategory }

    });

    
    if(update_category){

        res.redirect("/passwordCategory");


    }else{

        console.log("Not redirect ....passwordcategory");

    }
  
});



module.exports = router;