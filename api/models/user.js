const { default: mongoose } = require("mongoose");
// const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    // verified:{
    //     type:boolean,
    //     default:false
    // },
    verificationToken:{
        type:String,
    },
    profileImage:{
        type:String,
    },
    bio:{
        type:String,
        dafault:null,
    },
    connections :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    connectionRequest:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    sentConnectionRequest:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],

    
});

const User = mongoose.model("User",userSchema);
module.exports = User;