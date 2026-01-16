import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';
import admin from '../middleware/authMiddleware.js';


const router = express.Router();
//@route GET /api/admin/products
//@Desc get product info(Admin only)-name,email and role
//@access private

router.get('/', protect,admin, async (req,res) => {
    try {
        const products = await Product.find({});
        res.json(products)
    } catch (error) {
        console.error( error);
        res.status(500).send('Server Error')
    }
});

export default router;
