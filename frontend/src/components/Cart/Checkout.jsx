import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from 'axios';

/* const cart ={
    products : [
        {
            name: 'Stylish Jacket',
            size : 'M',
            color:'Black',
            price: 120,
            image:'https://picsum.photos/500/500/?random=1',
        },
        {
            name: 'Stylish Jeans',
            size : 'M',
            color:'Black',
            price: 100,
            image:'https://picsum.photos/500/500/?random=2',
        },
        {
            name: 'Stylish Sneakers',
            size : 'F',
            color:'Black',
            price: 60,
            image:'https://picsum.photos/500/500/?random=3',
        },
        {
            name: 'Stylish Shirt',
            size : 'F',
            color:'Black',
            price: 50,
            image:'https://picsum.photos/500/500/?random=4',
        },
    ],
    totalPrice :330,
}; */

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {cart, loading, error}= useSelector((state)=>state.cart);
    const {user} = useSelector((state)=> state.auth);
    const [checkoutId, setCheckoutId] = useState(null)
    const [shippingAddress, setShippingAddress]= useState({
        firstName:'',
        lastName :'',
        address : '',
        city: '',
        postalCode : '',
        country : '',
        phone: '',

    });

    // ensure the cart is loaded before proceeding
    useEffect(()=>{
        if(!cart || !cart.products || cart.products.length === 0){
            navigate('/');
        }

    }, [cart, navigate]);
    const handleCreatedCheckout =async (e) =>{
        e.preventDefault();
        if(cart && cart.products.length > 0) {
            const res =await dispatch(createCheckout({
                checkoutItems : cart.products,
                shippingAddress,
                paymentMethod: 'Paypal',
                totalPrice : cart.totalPrice,
            })
        );
        if(res.payload && res.payload._id){
            setCheckoutId(res.payload._id); // set checkout ID if checkout was successful
        }
        }

    };

    const handlePaymentSuccess = async (details)=>{
try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`, {
        paymentStatus : 'paid',
        paymentDetails : details,
    },
    {
        headers :{
            Authorization : `Bearer ${localStorage.getItem('userToken')}`
        },
    }

);
await handleFinalizeCheckout(checkoutId); // finalize checkout if payment was successful
} catch (error) {
    console.error(error);
}
/* navigate('/order-confirmation') */

const handleFinalizeCheckout = async(checkoutId)=>{
    try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,{},
        {
        headers :{
            Authorization : `Bearer ${localStorage.getItem('userToken')}`
        },
    },
     );
     navigate('/order-confirmation')
    } catch (error) {
       console.error(error) 
    }

}
    };
    if (loading) return <p>Loading cart...</p>
    if (error) return <p>Error : {error}</p>
    if(!cart || !cart.products || !cart.products.length === 0){
        return <p>Your cart is empty</p>
    }
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
        {/* Left section */}
        <div className="bg-white rounded-lg p-6 ">
            <h2 className="uppercase text-xl mb-6">Checkout</h2>
            <form onSubmit={handleCreatedCheckout}>
                <h3 className="text-lg mb-4">Contact Details</h3>
                <div className="mb-4">
                    <label className='block text-gray-700 '>Email</label>
                    <input type="email" value={user? user.email : ''} disabled className='w-full p-2 rounded border ' />
                </div>
                <h3 className='text-xl mb-4 '>Delivery</h3>
                <div className="mb-4 grid grid-cols-2 gap-4" >
                    <div>
                        <label className='block text-gray-700 '> First Name</label>
                        <input 
                        type="text" 
                        className='w-full p-2 border rounded'
                         required
                         value={shippingAddress.firstName}
                         onChange={(e)=>setShippingAddress({...shippingAddress, firstName:e.target.value})} />
                    </div>
                    <div>
                        <label className='block text-gray-700 '> Last Name</label>
                        <input 
                        type="text" 
                        className='w-full p-2 border rounded'
                         required
                         value={shippingAddress.lastName}
                         onChange={(e)=>setShippingAddress({...shippingAddress, lastName:e.target.value})} />
                    </div>
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700 '> Address</label>
                    <input 
                        type="text" 
                        className='w-full p-2 border rounded'
                         required
                         value={shippingAddress.address}
                         onChange={(e)=>setShippingAddress({...shippingAddress, address:e.target.value})} />
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4" >
                    <div>
                        <label className='block text-gray-700 '> City</label>
                        <input 
                        type="text" 
                        className='w-full p-2 border rounded'
                         required
                         value={shippingAddress.city}
                         onChange={(e)=>setShippingAddress({...shippingAddress, city:e.target.value})} />
                    </div>
                    <div>
                        <label className='block text-gray-700 '> Postal Code</label>
                        <input 
                        type="text" 
                        className='w-full p-2 border rounded'
                         required
                         value={shippingAddress.postalCode}
                         onChange={(e)=>setShippingAddress({...shippingAddress, postalCode:e.target.value})} />
                    </div>

                </div>
                <div className="mb-4">
                    <label className='block text-gray-700 '> Country</label>
                    <input 
                        type="text" 
                        className='w-full p-2 border rounded'
                         required
                         value={shippingAddress.country}
                         onChange={(e)=>setShippingAddress({...shippingAddress, country:e.target.value})} />
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700 '> Phone No</label>
                    <input 
                        type="tel" 
                        className='w-full p-2 border rounded'
                         required
                         value={shippingAddress.phone}
                         onChange={(e)=>setShippingAddress({...shippingAddress, phone:e.target.value})} />
                </div>
                <div className="mt-4">
                    {!checkoutId ? (
                        <button type='submit' className='w-full bg-black text-white py-3 rounded'>Continue To Payment</button>) : (<div>
                            <h3 className='text-lg mb-4'>Pay with Paypal</h3>
                            {/* Paypal button component */}
                            <PayPalButton amount={cart.totalPrice} onSuccess={handlePaymentSuccess}  onError={(err) =>alert('Payment failed. Try again')}/>
                        </div>)}
                </div>
            </form>
        </div>
        {/* Right Section */}
        <div className="bg-gray-50 p-6 rounded-lg ">
            <h3 className="text-lg mb-4">Order Summary</h3>
            <div className="border-t py-3 mb-4">
                {cart.products.map((product,index)=>(
                    <div key={index} className='flex items-start justify-between py-2 border-b'>
                        <div className="flex items-start">
                            <img src={product.image} alt="product image" className='w-20 h-24 object-cover mr-4' />
                            <div>
                                <h3 className="text-md">{product.name}</h3>
                                <p className='text-gray-500'>Size :{product.size}</p>
                                <p className='text-gray-500'>Color :{product.color}</p>
                            </div>
                        </div>
                        <p className='text'>  £{product.price?.toLocaleString()}</p>
                    </div>

                ))}
            </div>
            <div className="flex justify-between items-center text-lg mb-4">
                <p>Subtotal</p>
                <p>£{cart.totalPrice?.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center text-lg ">
                <p>Shipping</p>
                <p>Free</p>
            </div>
            <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t">
                <p>Total</p>
                <p>£{cart.totalPrice?.toLocaleString()}</p>
            </div>
        </div>
    </div>
  )
}

export default Checkout