import express from 'express';
import multer from "multer";
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();



//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});


//set up multer using memory storage //handles multipart formdata and uploading of files
const storage = multer.memoryStorage(); //it tells multer to store the uploaded pix directly in the lab instead of sending it in the cloud system
const upload = multer({storage});
router.post('/', upload.single('image'), async (req,res) => {
    try {
        if(!req.file){
            return res.status(404).json({message:'File upload not found'});
        }
        //function to handle the stream upload to cloudinary 
        const streamUpload = (fileBuffer)=>{
            return new Promise((resolve, reject)=>{
                const stream = cloudinary.uploader.upload_stream((error, result)=>{   //it streams the file directly
                    if (result){
                        resolve(result);
                    }else {
                        reject(error);
                    }
                });
                //use streamifier to convert file buffer into a stream
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        }
        // call stream upload function to upload the file
        const result = await streamUpload(req.file.buffer);

        //res with uploaded image url
        res.json({imageUrl:result.secure_url})

    } catch (error) {
        console.error( error);
        res.status(500).send('Server Error')
    }
})

export default router;
