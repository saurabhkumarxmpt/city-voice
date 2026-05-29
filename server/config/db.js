const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.info('database connect');
    }catch(error){
        console.error("something went wrong",error.message);
    }
}

module.exports=connectDB;