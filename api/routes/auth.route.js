import { Express } from "express";
import { signup } from "../controllers/auth.controller";

const router = Express.router();

router.post('/signup', signup);

export default router;