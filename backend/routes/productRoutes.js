import express from 'express';
import Product from "../models/Product.js";
import { protect} from '../middleware/authMiddleware.js';
import admin from '../middleware/authMiddleware.js';
const router = express.Router();


//@route POST /api/products
//@Desc create a new product in the database
//@access private/admin


router.post('/',protect,admin,async (req,res) => {
    try {
        const{name,description,price, discountPrice, countInStock,category,brand, sizes, colors, collections, material, gender,images, isFeatured, isPublished, tags, dimensions, weight, sku}=req.body;

        const product = new Product({name,description,price, discountPrice, countInStock,category,brand, sizes, colors, collections, material, gender,images, isFeatured, isPublished, tags, dimensions, weight, sku, user:req.user._id, //refers to the admin user id who creates the product
            });

            const createdProduct = await product.save();
            res.status(201).json(createdProduct);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error')
        
    }
});

//@route PUT /api/products/:id
//@Desc update an existing product ID
//@access private/admin

router.put('/:id',protect,admin,async (req,res) =>{
    try {
        const{name,
            description,
            price, 
            discountPrice,
             countInStock,
             category,
             brand, 
             sizes, 
             colors,
              collections,
               material, 
               gender,
               images, 
               isFeatured,
                isPublished,
                 tags, 
                 dimensions,
                  weight, 
                  sku,
                }=req.body;

        //Find product by ID
        const product = await Product.findById(req.params.id);
        if(product){
            //update the product fields
            product.name= name || product.name;
            product.description= description || product.description;
            product.price= price || product.price;
            product.discountPrice= discountPrice || product.discountPrice;
            product.countInStock=countInStock || product.countInStock;
            product.category=category || product.category;
            product.brand=brand || product.brand;
            product.sizes=sizes || product.sizes;
            product.colors=colors || product.colors;
            product.collections=collections || product.collections;
            product.material=material || product.material;
            product.gender=gender || product.gender;
            product.images=images || product.images;
            product.isFeatured= 
            isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished=
            isPublished !== undefined ?  isPublished : product.isPublished;
            product.tags=tags || product.tags;
            product.dimensions=dimensions || product.dimensions;
            product.weight=weight || product.weight;
            product.sku=sku || product.sku;

            //Save the updated product to database
            const updatedProduct =await product.save();
            res.json(updatedProduct);

        }else {
            res.status(404).json({message:'Product not found'})
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        
    }

});

//@route DELETE /api/products
//@Desc delete an existing product by ID
//@access private/admin

router.delete('/:id', protect,admin, async (req,res) => {
    try {

        //find the product in the database using the ID
        const product = await Product.findById(req.params.id);
        if(product){
            // remove it from database
            await product.deleteOne();
            res.json({message:'Product Deleted successfully'})
        }else {
            res.status(404).json({message:'Product Not Found'})
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        
    }
});

//@route GET /api/products
//@Desc Get all products with optional query filters
//@access Public

router.get('/', async (req,res) => {
    try {
        const {collection,
             size, 
             color,
              gender,
              minPrice, 
              maxPrice, 
              sortBy,
               search, 
               category, 
               material,
                brand,
                 limit,
                }= req.query;

                let query = {};

                // filter logic based on query parameter
                if(collection && collection.toLocaleLowerCase() !== 'all') {
                    query.collections = collection;
                }
                if(category && category.toLocaleLowerCase() !== 'all') {
                    query.category = category;
                };

                if(material){
                    query.material = {$in: material.split(' ,')};
                }
                if(brand){
                    query.brand = {$in: brand.split(' ,')};
                }
                if(size){
                    query.sizes = {$in: size.split(' ,')};
                }
                if(color){
                    query.colors = {$in: [color]};
                }
                if(gender){
                    query.gender = gender;
                }

                if(minPrice || maxPrice){
                    query.price = {};
                    if(minPrice) query.price.$gte = Number(minPrice); //gte: greater than
                    if(maxPrice) query.price.$lte = Number(maxPrice);
                };
                if(search){
                    query.$or = [
                        {name:{$regex : search, $options:'i'}},
                        {description:{$regex : search, $options:'i'}},
                    ];
                }
                // sort logic
                let sort = {}
                if(sortBy){
                    switch (sortBy) {
                        case 'priceAsc': sort = {price: 1};
                            
                            break;
                        case 'priceDesc': sort = {price: -1};
                            
                            break;
                        case 'popularity': sort = {rating: -1};
                            
                            break;
                    
                        default:
                            break;
                    }
                };

                //fetch products from DB and apply sorting and limit

                let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
                res.json(products);
        
    } catch (error) {
        console.log(error);
        rex.status(500).send('Server Error')
        
    }
    
});


//@route GET /api/products/best-seller
//@Desc retrieve the products  with highest rating.
//@access Public // it should come b4 product with id for it to work

router.get('/best-seller', async (req,res) => {
    try {
        const bestSeller = await Product.findOne().sort({rating:-1});
        if(bestSeller){
            res.json(bestSeller)
        }else{
            res.status(404).json({message:'No best seller product'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error')
        
    }
});
//@route GET /api/products/new-arrival
//@Desc retrieve latest 8 products based on creation date
//@access Public // it should come b4 product with id for it to work


router.get('/new-arrivals', async (req,res) => {
    try {
        // fetch the latest 8 products
        const newArrivals = await Product.find().sort({createdAt : -1}).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        
    }
})

//@route GET /api/product/:id
//@Desc Get a single product by ID
//@access Public


router.get('/:id', async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }else {
            res.status(404).json({message: 'Product Not Found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('server error')
    }
});

//@route GET /api/product/similar/:id
//@Desc retrieve similar products based on current product category and gender
//@access Public

router.get('/similar/:id', async(req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:'Product not found'});

        };

        const similarProducts = await Product.find({
            _id : {$ne:id}, //exclude current product ID, 'ne' mean NOT EQUAL TO
            gender : product.gender,
            category : product.category

        }).limit(4); //limiting the no of displayed product to 4 items
        res.json(similarProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
        
    }
});



export default router;
