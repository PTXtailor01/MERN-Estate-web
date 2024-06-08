import {signup , signin, google, signout} from '../controllers/auth.controller.js'
import Express from 'express'

const router = Express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);

export default router;