const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const User=require('../models/User');
const {sendVerificationEmail} =require('../utils/sendEmail');
const { ClientRequest } = require('http');

const generateToken=(userId)=>{
    jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'7d'});
}

exports.requestVerification=async(req,res,next)=>{
    try{
        const{email}=req.body;
        if(!email) return res.status(400).json({success:false,message:"email is required"});


        let user=await User.findOne({email});
        // if(user?.isVerified){
        //     return res.status(400).json({success:false, message:"email is already registred"})
        // }

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
    }catch(err){next(err)}

}

exports.verifyEmail=async(req,res,next)=>{
    try{
        const token=req.query.token;
        if(!token) return res.status(400).json({success:false, message:"token missing"});

        const user=await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: {$gt: new Date()},
        });

        if(!user){
            return res.status(400).json({
                succuess:false,
                message:"token is not avaible! please try again"
            });
        }

        user.isVerified=true,
        user.verifyToken=undefined,
        user.verifyTokenExpiry=undefined
        await user.save();

        const jwtToken=generateToken(user._id);

        res.status(200).json({
            success:true,
            message:"Email verified! please complete the profile",
            token:jwtToken,
            nextStep:'complete-profile'
        })
    }catch(err){next(err)}
};

exports.completeProfile=async(req,res,next)=>{
    try{
        const {name,mobile,city}=req.body;

        if(!name || !mobile || !city){
            return res.status(400).json({success:false,message:"all fields are required"});
        }

        const user=await User.findByIdAndUpdate(
            req.user._id,
            {name,mobile,city,isProfileComplete:true},
            { new: true, select: '-verifyToken -verifyTokenExpiry' }
        );

         res.status(200).json({
            success: true,
            message: 'Profile complete ho gaya! 🎉',
            user,
            });
    }catch(err){next(err)}
}


exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.User });
};