import React from 'react'
import {RiDeleteBin3Line} from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

const CartContents = ({cart, userId, guestId}) => {
const dispatch = useDispatch();

// handle adding or subtracting to cart //delta default value = 1. used to + or -
const handleAddToCart=(productId, delta, quantity, size, color)=>{
    const newQuantity = quantity + delta;
    if(quantity >= 1){
        dispatch(updateCartItemQuantity({
            productId,
            quantity : newQuantity,
            guestId,
            userId,
            size,
            color,
        }))
    }

}
   /*  const cartProducts = [
        {
            productId :1,
            name:"T-shirt",
            size : "M",
            color :"Red",
            quantity :"1",
            price : "15",
            image: "https://picsum.photos/200?random=1"

        },
        {
            productId :2,
            name:"Jeans",
            size : "L",
            color :"Blue",
            quantity :"1",
            price : "25",
            image: "https://picsum.photos/200?random=2"

        }
    ] */
  
  const handleRemoveFromCart = (productId, size, color)=>{
    dispatch(removeFromCart({productId, guestId, userId, size, color}))
  }
        return (
    <div>
        {cart.products.map((product,index)=>(
            <div key={index} className='flex items-start justify-between py-4 border-b '>
                <div className='flex items-center'>
                    <img src={product.image} alt={product.name} className='object-cover w-20 h-24 mr-4 rounded'/>
                    <div>
                        <h3>{product.name}</h3>
                        <p className='text-sm text-gray-500 '>{product.size} | color : {product.color}</p>
                        <div className='flex mt-2 items-center'> 
                            <button onClick={()=>handleAddToCart(product.productId,-1, product.quantity, product.size, product.color)} className='border rounded px-2 py-1 text-xl font-medium'>-</button>
                            <span className='mx-2'>{product.quantity}</span>
                        <button onClick={()=>handleAddToCart(product.productId,1, product.quantity, product.size, product.color)} className='border rounded px-2 py-1 text-xl font-medium'>+</button>

                        </div>
                    </div>
                </div>
                <div>
                <p>£{product.price.toLocaleString()}</p>
                <button  onClick={()=>handleRemoveFromCart(product.productId, product.size, product.color)}>
                    <RiDeleteBin3Line className='h-6 w-6 mt-2 text-red-600'/>
                </button>
                </div>
                 </div>
        ))}
    </div>
  )
}

export default CartContents