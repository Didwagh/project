// const mongoose = require ("mongoose");

// const postSchema = new mongoose.Schema({
//     description:String,
//     imageUrl:String,
//     user:{
//         type:mongoose.Schema.Types.objectId,
//         ref:"User",
//         required:true,
//     },
//     likes:[
//         {
//             user:{
//                 type:mongoose.Schema.Types.objectId,
//                 ref:"User",
//             }
//         }
//     ],
//     likes:[
//         {
//             user:{
//                 type:mongoose.Schema.Types.objectId,
//                 ref:"User",
//             },
//             text:String,
//         }
//     ],
// })

// const Post = mongoose.model("Post",postSchema);
// module.exports = Post;