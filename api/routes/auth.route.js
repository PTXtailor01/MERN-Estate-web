import signup from '../controllers/auth.controller.js'
import Express from 'express'

const router = Express.Router();

router.post('/signup', signup);

export default router;