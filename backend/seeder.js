import mongoose from "mongoose";
import dotenv from 'dotenv';
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import Product from "./models/Product.js";
import products from "./data/products.js";

dotenv.config();

//connect to mongoDB

mongoose.connect(process.env.MONGODB_URI);

// function to seed data

const seedData = async () => {
    try {
        // Clear existing data 

        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        //create a default admin user

        const createdUser = await User.create({
            name : 'admin User',
            email : 'carlosaniakorchukwu@gmail.com',
            password: "Carlos.042",
            role:'admin'
        });

        // assign default user id to each product
        const userID = createdUser._id;
        const sampleProducts = products.map((product)=>{
            return {...product, user: userID};
        });

        // insert product into database
        await Product.insertMany(sampleProducts);
        console.log('Product data Seeded successfully');
        process.exit();
    } catch (error) {
        console.error('error seeding the data :', error);
        process.exit(1);
        
    }
    
};

seedData();



