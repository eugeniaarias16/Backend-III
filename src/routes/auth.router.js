import { Router } from 'express';
import { loginController, getCurrentUser, registerController,requestPasswordReset,logoutController, resetPassword } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', loginController);
router.get('/logout', authenticateJWT, logoutController);
router.get('/current', authenticateJWT, getCurrentUser);
router.post('/register', registerController);
router.post('/forgot-password', requestPasswordReset); 
router.post('/reset-password', resetPassword); 

export default router;