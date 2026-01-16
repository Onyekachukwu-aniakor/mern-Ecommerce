import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();


//middleware to protect route
export  const protect = async (req,res,next) => {
    let token;

    if(req.headers.authorization &&
         req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1]; //1 bcos token comes after the Bearer
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.user.id).select("-password") //exclude password
            return next();
            
        } catch (error) {
            console.error('Token verification failed :', error)
            res.status(401).json({message:'Not authorized, token failed'})
            
        }
    } else{
        res.status(401).json({message:'Not authorized, no token provided'});
    }
};

//middleware to check if the user is admin

const admin = (req,res,next)=>{
    if(req.user && req.user.role === 'admin'){
        next()
    }else {
        res.status(403).json({message: 'Not Authorised as the admin'})
    }
}

export default admin;