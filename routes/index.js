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

router.get("/", (req, res, next) => {

    const loginUser = localStorage.getItem("loginUser");
    if (loginUser) {
        res.redirect("./dashboard");
    } else {

        res.render("index", { title: "Password Management System", msg: "" });

    }


});

router.post("/", (req, res, next) => {

    const username = req.body.uname;
    const password = req.body.password;
    const checkUser = userModel.findOne({ username: username });
    checkUser.exec((err, data) => {
        if (err) throw err;
        const getUserID = data._id;
        const getPassword = data.password;
       // console.log("----------", bcrypt.compareSync(password, getPassword))
        if (bcrypt.compareSync(password, getPassword)) {

            const token = jwt.sign({ userID: getUserID }, 'loginToken');
            console.log(token);
            localStorage.setItem("userToken", token);
            localStorage.setItem('loginUser', username);

            res.redirect("/dashboard");
        } else {
            res.render("index", { title: "Password Management System", msg: "Invalid Username and Password" });
        }
    })

});



router.get("/signup", (req, res) => {

    const loginUser = localStorage.getItem("loginUser");
    if (loginUser) {
        res.redirect("./dashboard");
    } else {

        res.render("index", { title: "Password Management System", msg: "" });

    }

    res.render("signup", { title: "Password Management System", msg: "" });
});

router.post("/signup", checkusername, checkemail, (req, res) => {

    const username = req.body.uname;
    const email = req.body.email;
    let password = req.body.password;
    const confpassword = req.body.confpassword;

    if (password != confpassword) {


        res.render("signup", { title: "Password Management System", msg: "Password Not Match" });


    } else {

        password = bcrypt.hashSync(req.body.password, 10);

        const userdetails = new userModel({
            username: username,
            email: email,
            password: password

        })

        userdetails.save((err, doc) => {
            if (err) throw err;


            res.render("signup", { title: "Password Management System", msg: "User Registerd Successfully" });

        });
    }


});


router.get("/add-new-password", chechLoginUser, (req, res) => {

    const loginUser = localStorage.getItem("loginUser");
    const getPassCat = passcatModel.find({});
    getPassCat.exec((err,data)=>{
        if(err) throw err;

        res.render("add-new-password", { title: "Password Management System", loginUser: loginUser, records:data, success: ''});

    })
  
});

router.post("/add-new-password", chechLoginUser, async (req, res) => {

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

/**

router.get("/view-all-password",chechLoginUser, (req, res) => {

    const loginUser = localStorage.getItem("loginUser");

    const perPage = 4;
    const page = 1;

    const getAllpass = passModel.find({});
    getAllpass.skip((perPage * page) - perPage).limit(perPage).exec((err,data)=>{
        if(err) throw err;

        passModel.countDocuments({}).exec((err,count)=>{

            res.render("view-all-password", { title: "Password Management System", loginUser: loginUser ,
            records:data,
            current:page,
            pages:Math.ceil(count/perPage)
        
        });

        });

    });
 });



router.get("/view-all-password/:page",chechLoginUser, (req, res) => {

    const loginUser = localStorage.getItem("loginUser");

    const perPage = 4;
    const page = req.params.page || 1;

    const getAllpass = passModel.find({});
    getAllpass.skip((perPage * page) - perPage).limit(perPage).exec((err,data)=>{
        if(err) throw err;

        passModel.countDocuments({}).exec((err,count)=>{

            res.render("view-all-password", { title: "Password Management System", loginUser: loginUser ,
            records:data,
            current:page,
            pages:Math.ceil(count/perPage)
        
        });

        });

    });
 });

  */


// pagintion using plugin 
 router.get("/view-all-password",chechLoginUser, (req, res) => {

    const loginUser = localStorage.getItem("loginUser");

    var options = {
       
        offset:   1, 
        limit:    3
    };
     

    passModel.paginate({},options).then((result) =>{
      //  if(err) throw err;

       // console.log(result)
       

            res.render("view-all-password", { title: "Password Management System", loginUser: loginUser ,
            records:result.docs,
            current:result.offset,
            pages:Math.ceil(result.total/result.limit)
        
        

        });

    });
 });


 router.get("/view-all-password/:page",chechLoginUser, (req, res) => {

    const loginUser = localStorage.getItem("loginUser");

    const perPage = 4;
    const page = req.params.page || 1;

    const getAllpass = passModel.find({});
    getAllpass.skip((perPage * page) - perPage).limit(perPage).exec((err,data)=>{
        if(err) throw err;

        passModel.countDocuments({}).exec((err,count)=>{

            res.render("view-all-password", { title: "Password Management System", loginUser: loginUser ,
            records:data,
            current:page,
            pages:Math.ceil(count/perPage)
        
        });

        });

    });
 });


 router.get("/password-detail/", chechLoginUser, (req, res) => {

   res.redirect("/dashboard");
 
 });

 router.get("/password-detail/edit/:id", chechLoginUser, (req, res) => {

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



 router.post("/password-detail/edit/:id", chechLoginUser, (req, res) => {

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


 router.get("/password_detail/delete/:id", chechLoginUser, (req, res) => {

    const loginUser = localStorage.getItem("loginUser");

    const id = req.params.id;
   
    const passdelete = passModel.findByIdAndDelete(id);


    passdelete.exec((err) => {

        if (err) throw err;

        res.redirect("/view-all-password");

    })


});


router.get("/logout", (req, res) => {
    localStorage.removeItem("userToken");
    localStorage.removeItem('loginUser');
    res.redirect("/");
});



module.exports = router;