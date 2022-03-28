const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
    Password_category:{
        type:String,
        required:true,
    },
    project_name: 
        {type:String, 
        required: true,
       },

    Password_detail:{
        type:String,
        required:true,
    },

    date:{
        type:Date,
        default:Date.now
    }

});

const passModel = mongoose.model('password_details',passSchema);
module.exports =  passModel;