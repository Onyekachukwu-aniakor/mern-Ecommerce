import express from 'express';
import User from '../models/User.js';
import admin from '../middleware/authMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


//@route GET /api/admin/users
//@Desc get all users(Admin only)
//@access private

router.get('/', protect,admin, async (req,res) => {
    try {
        const users = await User.find({}); //finding all users
        res.json(users);
    } catch (error) {
        console.error( error);
        res.status(500).send('Server Error')
    }

    
});


//@route POST /api/admin/users
//@Desc add a new user(Admin only)
//@access private
router.post('/', protect,admin, async (req,res) => {
    const{name,email,password,role}= req.body;
    try {
        const user = await User.findOne({email}); 
        if (user){
            return res.status(400).json({message:'User already exist'});

        }
        //create new user
        user = new User({
            name,
            email,
            password,
            role: role ||'customer',
        });

        await user.save();
        res.status(201).json({message:'user created successfully'})
        
    } catch (error) {
        console.error( error);
        res.status(500).send('Server Error')
    }

    
});


//@route PUT /api/admin/users
//@Desc update user info(Admin only)-name,email and role
//@access private

router.put('/:id',protect,admin,async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user){
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.role = req.body.role || user.role
        }

        const updatedUser = await user.save();
        res.json({message:'user updated successfully', user: updatedUser})
    } catch (error) {
        console.error( error);
        res.status(500).send('Server Error')
        
    }
    
});

//@route DELETE /api/admin/users/delete
//@Desc Delete user info(Admin only)-name,email and role
//@access private

router.delete('/:id', protect,admin,async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({message:'User deleted successfully'})
        }else {
            res.status(404).json({message:'user not found'})
        }
    } catch (error) {
        console.error( error);
        res.status(500).send('Server Error')
    }
});

export default router;