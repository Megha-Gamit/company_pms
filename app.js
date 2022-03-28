const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const indexRouter = require("./routes/index");
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

