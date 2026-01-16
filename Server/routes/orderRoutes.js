import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//@route GET /api/orders/my-orders
//@Desc get logged-in user's orders
//@access private
 router.get('/my-orders',protect, async (req,res) => {
    try {
        // fetch all the orders for the authenticated users
        const orders = await Order.find({user: req.user._id}).sort({createdAt : -1,}

        );// sort by most recent orders
        res.json(orders);
    } catch (error) {
        console.error( error);
        res.status(500).send('Server Error')
    }
    
 });

 //@route GET /api//my-orders/:id
//@Desc get order details by ID
//@access private

router.get('/:id', protect, async (req,res) => {
    try {
         const order = await Order.findById(req.params.id).populate( 'user', 'name email');
     if(!order){
        return res.status(404).json({message:'Order not found'});
     }
     //return the full order details when order is found
     res.json(order)
    } catch (error) {
         console.error( error);
        res.status(500).send('Server Error')
        
    }   
});

export default router;