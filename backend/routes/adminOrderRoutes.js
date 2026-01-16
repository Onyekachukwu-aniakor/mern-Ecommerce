import express from 'express';
import admin from '../middleware/authMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
const router = express.Router()

//@route GET /api/admin/orders
//@Desc get all orders info(Admin only)-name,email and role
//@access private

router.get('/',protect,admin,async (req,res) => {
    try {
        const orders = await Order.find({}).populate('users', 'name email');
        res.json(orders);
    } catch (error) {
        console.error( error);
        res.status(500).send('Server Error')
    }
});

//@route PUT /api/admin/orders/:id
//@Desc get all orders status(Admin only)
//@access private

router.put('/:id', protect,admin,async (req,res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name');
        if(order){
            order.status= req.body.status || order.status;
            order.isDelivered = req.body.status === 'Delivered'? true : order.isDelivered;
            order.deliveredAt = req.body.status === 'Delivered'? Date.now() : order.deliveredAt;

            const updatedOrder = await order.save();
            res.json(updatedOrder)

        } else {
            res.status(404).json({message:'Order does not exist'})
        }
    } catch (error) {
         console.error( error);
        res.status(500).send('Server Error')
    }
});

//@route DELETE /api/admin/orders/:id
//@Desc delete an order(Admin only)
//@access private

router.delete('/:id', protect,admin,async (req,res) => {
    try {
        const order= await Order.findById(req.params.id);
        if(order){
            await order.deleteOne();
            res.json({message: 'order deleted successfully'})
        }else {
            res.status(404).json({message:'Order  not found'})
        }
    } catch (error) {
         console.error( error);
        res.status(500).send('Server Error')
    }
});

export default router;