import express from 'express';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

//@rouet POST /api/subscribe
//@Desc handle news letter subscription
//@access public

router.post('/subscribe', async (req,res) => {
    const {email}= req.body;
    if(!email){
        return res.status(400).json({message:'Email required'});
    }
    try {
        // check if the email is alreday subscribed
        let subscriber = await Subscriber.findOne({email});
        if(subscriber){
            return res.status(400).json({message:'Email already subscribed'});
        }
        //create a new subscriber
        subscriber = new Subscriber({email});
        await subscriber.save();
         res.status(201).json({message:'email subscribed successfully to newsletter'});
    } catch (error) {
        console.error( error);
        res.status(500).send('Server Error')
    }
});

export default router;