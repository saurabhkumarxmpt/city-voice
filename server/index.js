require('dotenv').config();
const express=require('express');
const PORT=process.env.PORT || 3000;
const app=express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message:"this is the home"});
});

app.listen(PORT,(err)=>{
    if(err){
        console.error(err.message);
    }else{
        console.info("server is run");
    }
});