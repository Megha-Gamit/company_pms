const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const indexRouter = require("./routes/index");
const dashboardRouter = require("./routes/dashboard");

const addnewcategoryRouter = require("./routes/add-new-category");
const viewPassCatRouter = require("./routes/passwordCategory");
const addnewpasswordRouter = require("./routes/add-new-password");
const viewallpasswordRouter = require("./routes/view-all-password");
const passworddetailRouter = require("./routes/password-detail");

//const userRouter= require("./routes/users");
//const empModel = require('./modules/employee')
//const uploadModel = require("./modules/upload");
const router = express.Router(); 

const app = express();

app.set('views',path.join(__dirname,'views'));
app.set("view engine",'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/',indexRouter);
app.use('/dashboard',dashboardRouter);
app.use('/add-new-category',addnewcategoryRouter);
app.use('/passwordCategory',viewPassCatRouter);
app.use('/add-new-password',addnewpasswordRouter);
app.use('/view-all-password',viewallpasswordRouter);
app.use('/password-detail',passworddetailRouter);



mongoose.connect("mongodb+srv://Megha:megha*12345@cluster0.vi6gd.mongodb.net/PMS?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Database not connected");
  });



  app.listen(3000,()=>{
      console.log("lisining on 3000");
  })

