import express from 'express'

import { protectRoute } from '../middlewears/auth.middlewear.js';
import { sendingfollowingrequest, acceptrequest, rejectrequest, unfollowuser,getsendingrequestuser,getpendingrequestusers } from '../controllers/followercontrolling.js';

const router = express.Router();

router.post('/send-request',protectRoute, sendingfollowingrequest);
router.post('/accept-request', protectRoute, acceptrequest);
router.post('/reject-request', protectRoute, rejectrequest);
router.post('/unfollow',protectRoute, unfollowuser);

router.get('/get-sendingrequestuser',protectRoute, getsendingrequestuser);
router.get('/get-pendingrequestuser',protectRoute, getpendingrequestusers);

export default router