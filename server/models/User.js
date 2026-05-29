const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    name:{
        type:String,
        default:null
    },
    mobile:{
        type:String,
        default:null
    },
    city:{
        type:String,
        default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isProfileComplate:{
        type:Boolean,
        default:false
    },
    verifyToken:{
        type:String
    },
    verifyTokenExpiry:{
        type:Date
    },
    role:{
        type:String,
        enum:['user,admin'],
        default:'user'
    }
},{timestamps:true});

module.exports=mongoose.model('User',userSchema);