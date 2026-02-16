// EXTERNAL MODULES
const express=require('express');

// LOCAL MODULES
const authController=require('../controllers/authController');

const authRouter=express.Router();

authRouter.get('/signup',authController.getSignup);
authRouter.post('/signup',authController.postSignup);
authRouter.get('/login',authController.getLogin);
authRouter.post('/login',authController.postLogin);
authRouter.post('/logOut',authController.postLogOut);

module.exports=authRouter;