import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router =express.Router();

// helper function to get a cart either by user ID or guest ID

const getCart = async (userId, guestId) => {
    if(userId){
        return await Cart.findOne({user:userId})
    } else if (guestId){
        return await Cart.findOne({guestId});
    }
    return null;
    
}


//@route POST /api/cart
//@Desc add a product to the cart for a guest or logged in user
//@access Public

router.post('/', async (req,res) => {
    const {productId,quantity, size, color, guestId, userId}= req.body;
    try {
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({message:'Product not found'});
        // deteremine if the user is a guest or logged in

        let cart = await getCart(userId, guestId);
        // if cart exist, update it
        if(cart){
            const productIndex = cart.products.findIndex( (p)=>
            p.productId.toString()=== productId && 
            p.size === size &&
            p.color === color
            );

            if(productIndex > -1){
                //if the product already exist, update the quantity
                cart.products[productIndex].quantity += quantity; 

            }else {
                // add new products

                cart.products.push({
                    productId,
                    name : product.name,
                    image : product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }
            //Recalculate the totalPrice
            //initial acc value = 0

            cart.totalPrice = cart.products.reduce(
                (acc, item)=> acc + item.price * item.quantity, 
            0
        ); 

            await cart.save();
            res.status(200).json(cart)
        }else {
            // create a new cart for guest or user

            const newCart = await Cart.create({
                user : userId ? userId : undefined,
                guestId : guestId ? guestId : 'guest_' + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image : product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                 },
                ],
                totalPrice : product.price * quantity,
            });
            return res.status(201).json(newCart);
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message :'Server Error'});
        
    }
});

//@route PUT /api/cart
//@Desc update product quantity in the cart for the guest and logged in user
//@access public

router.put('/', async (req,res) => {
    const {productId,quantity, size, color, guestId, userId}= req.body;
    try {
        let cart = await getCart(userId, guestId);
        if(!cart) return res.status(404).json({message:'Cart not found'})
            //get product index
         const productIndex = cart.products.findIndex( (p)=>
            p.productId.toString() === productId && 
            p.size === size &&
            p.color === color
            );

            if(productIndex > -1){
                // update the quantity
                if(quantity >0){
                    cart.products[productIndex].quantity = quantity; 
                }else {
                    cart.products.splice(productIndex,1); //remove product if qty is 0
                }
                cart.totalPrice = cart.products.reduce(
                (acc, item)=> acc + (item.price * item.quantity), 
            0
        );

        await cart.save();
            res.status(200).json(cart);
                

            }else {
                return res.status(404).json({message:'product not found in cart'})
            }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message :'Server Error'});
    }
    
});

//@route DELETE /api/cart
//@Desc remove product from the cart
//@access public

router.delete('/', async (req,res) => {
    const {productId, size, color, guestId, userId}= req.body;
    try {
        let cart = await getCart(userId, guestId);
        if(!cart) return res.status(404).json({message:'Cart not found'})
            //get product index
         const productIndex = cart.products.findIndex( (p)=>
            p.productId.toString()=== productId && 
            p.size === size &&
            p.color === color
            );

             if(productIndex > -1){
                    cart.products.splice(productIndex,1); 
                    cart.totalPrice = cart.products.reduce(
                (acc, item)=> acc + (item.price * item.quantity),0);
                await cart.save();
            res.status(200).json(cart);
                    
                }else {
                    return res.status(404).json({message:'product not found in cart'})
                }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message :'Server Error'});
        
    }
    
});

//@route GET /api/cart
//@Desc get logged-in user's cart or guest user's cart
//@access public

router.get('/', async (req,res) => {
    const {userId, guestId}= req.query;
    try {
        const cart = await getCart(userId, guestId);
        if(cart) {
             res.json(cart)
        }else {
            return res.status(404).json({message:'cart not found '})

        }
        
         
    } catch (error) {
        
        console.error(error);
        res.status(500).json({message :'Server Error'});
    }
    
});

//@route /api/cart/merge
//@Desc Merge guest cart to user cart on log in
//@access private
 router.post('/merge',protect, async (req,res) => {
    const {guestId}= req.body;
    try {
        // find the guest cart and the user cart
        const guestCart= await Cart.findOne({guestId});
        const userCart= await Cart.findOne({user : req.user._id});
        if(guestCart){
            if(guestCart.products.length === 0) {
                return res.status(400).json({message:'Guest cart is empty'});
            }
            if(userCart){
                //merge guestCart into user cart
                guestCart.products.forEach((guestItem)=>{
                    const productIndex = userCart.products.findIndex((item)=> 
                        item.productId.toString() === guestItem.productId.toString() &&
                     item.size=== guestItem.size && 
                    item.color === guestItem.color);
                    if(productIndex > -1){
                        // if the item exist in the user cart, update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;

                    }else {
                        //otherwise, Add the guestItem to the cart
                        userCart.products.push(guestItem);
                    }
                });
                userCart.totalPrice = userCart.products.reduce((acc,item)=> acc + (item.price * item.quantity), 0);
                await userCart.save();

                // remove the guestCart after merging
                try {
                    await Cart.findOneAndDelete({guestId});
                } catch (error) {
                    console.error('Error deleting guest cart :',error);
                    
                }
                res.status(200).json(userCart)
            }else {
                //if the user has no existing cart, assign guestCart to the user
                guestCart.user= req.user._id;
                guestCart.guestId= undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }
        }else {
            if (userCart){
                //guest cart has already been merged, return userCart
                res.status(200).json(userCart)
            }
            res.status(400).json({message:'Guest cart not found'});
        }
        
    } catch (error) {
         console.error(error);
        res.status(500).json({message :'Server Error'});
        
    }
    
 })

export default router;