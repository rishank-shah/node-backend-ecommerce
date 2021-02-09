const Product = require('../models/product')
const slugify = require('slugify')

exports.create = async(req,res) =>{
    try{
        req.body.slug = slugify(req.body.title)
        const product = await new Product(req.body)
        .save()
        res.json(product)
    }catch(err){
        res.status(400).json({
            err:err.message
        })
    }
}

exports.listWithCount = async(req,res)=>{
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subcategories')
    .sort([['createdAt','desc']])
    .exec()
    res.json(products)
}

exports.deleteProduct = async(req,res)=>{
    try{
        let deleted = await Product.findOneAndRemove({slug:req.params.slug})
        .exec()
        res.json(deleted)
    }catch(err){
        res.status(400).semd('Product Delete Failed')
    }
}

exports.readProduct = async(req,res)=>{
    const product = await Product.findOne({slug:req.params.slug})
    .populate('category')
    .populate('subcategories')
    .exec()
    res.json(product)
}

exports.update = async(req,res)=>{
    try{
        const updateProduct = await Product.findOneAndUpdate({slug:req.params.slug},req.body,{new:true}).exec()
        res.json(updateProduct)
    }catch(err){
        console.log('UPDATING PRODUCT ERR',err)
        return res.status(400).json({'err':'Product update failed'})
    }
}