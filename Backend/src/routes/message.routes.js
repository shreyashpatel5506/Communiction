import express from 'express';
import { protectRoute } from '../middlewears/auth.middlewear.js';

const router = express.Router();

// router.post('/follwers',protectRoute,fetchfollowersuser);//for messages
// router.post('/alluser',protectRoute,fetchalluser);//for started follow any user 
// router.post('/send-message',protectRoute,sendmessage);
// router.post('/get-message',protectRoute,getmessage);

export default router;