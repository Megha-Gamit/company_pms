const mongoose = require("mongoose");

const passcatSchema = new mongoose.Schema({
    Password_category:{
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },

    
    date:{
        type:Date,
        default:Date.now
    }

});

const passcatModel = mongoose.model('password_categories',passcatSchema);
module.exports =  passcatModel;