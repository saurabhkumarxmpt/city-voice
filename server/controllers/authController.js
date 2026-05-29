const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const User=require('../models/User');
const {sendVerificationEmail} =require('../utils/sendEmail');

const generateToken=(userId)=>{
    jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'7d'});
}

exports.requestVerification=async(req,res,next)=>{
    try{
        const{email}=req.body;
        if(!email) return res.status(400).json({success:false,message:"email is required"});


        let user=await User.findOne({email});
        if(user?.isVerified){
            return res.status(400).json({success:false, message:"email is already registred"})
        }

        const token=crypto.randomBytes(32).toString('hex');
        const expiry=new Date(Date.now() + 15*60*1000);

        if(user){
            user.verifyToken= token,
            user.verifyTokenExpiry=expiry
            await user.save(); 
        }else{
            user=await User.create({
                email,
                verifyToken:token,
                verifyTokenExpiry:expiry

            });
        }

        await sendVerificationEmail(email,token);

        res.status(200).json({
            success:true,
            message:"Verification  is send! please check your email"
        });
    }

}