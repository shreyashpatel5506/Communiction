import express from 'express';
import { protectRoute } from '../middlewears/auth.middlewear.js';
import { fetchfollowersuser, fetchalluser, sendmessage, getmessage } from '../controllers/message.controllers.js';

const router = express.Router();

router.get('/follwers',protectRoute,fetchfollowersuser);//for messages
router.post('/alluser',protectRoute,fetchalluser);//for started follow any user 
router.post('/send-message/:id',protectRoute,sendmessage);
router.post('/get-message/:id',protectRoute,getmessage);

export default router;