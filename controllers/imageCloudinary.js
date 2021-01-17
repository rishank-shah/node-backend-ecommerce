const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.upload = async(req,res)=>{
    let result = await cloudinary.uploader.upload(req.body.image,{
        public_id:`${Date.now()}`, //image name
        resource_type:'auto'       //image type
    })
    res.json({
        public_id:result.public_id,
        url:result.secure_url
    })
}

exports.remove = (req,res)=>{
    let imageID = req.body.public_id
    cloudinary.v2.uploader.destroy(imageID,(err,result)=>{
        if(err){
            return res.status(400).json({
                err
            })
        }
        res.json({
            message:'Deleted Image'
        })
    })
}