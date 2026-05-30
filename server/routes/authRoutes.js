const router=require("express").Router();
const{requestVerification,verifyEmail,completeProfile,getMe}=require('../controllers/authController');
const {isAuthenticated}=require('../middlewares/authMiddleware');
router.post('/send-verification',requestVerification);
router.get('/verify-email',verifyEmail);
router.post('/complete-profile',isAuthenticated,completeProfile);
router.get('/me',getMe);

module.exports=router;