const mongoose = require('mongoose')
const  requestSchema=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    typeofrequest: {
        type: [String],
        enum: ['view', 'delect', 'download'],
        default: 'view'
    },
   status:{
        type: String,
        enum: ['pending', 'completed', 'rejected'],
        default: 'pending'
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    fileId:{
        type:String,
    }
})
const Requestmodel =mongoose.model('RequestModel',requestSchema)