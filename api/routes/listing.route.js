import express from "express";
import { createListing, deleteListing, getlisting, updateListing } from "../controllers/listing.controller.js";

const router = express.Router();

router.post('/create',createListing);
router.delete('/delete/:id',deleteListing);
router.post('/update/:id',updateListing);
router.get('/:id',getlisting);

export default router;
