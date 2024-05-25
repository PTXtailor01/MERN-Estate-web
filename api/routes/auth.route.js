import {signup , signin} from '../controllers/auth.controller.js'
import Express from 'express'

const router = Express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

export default router;