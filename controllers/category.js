const Category = require('../models/category')
const slugify = require('slugify')

exports.create = async(req,res)=>{
    try{
        const {name} = req.body
        const category = await new Category({
            name,
            slug: slugify(name)
        })
        .save()
        res.json(category)
    }catch(err){
        res.status(400).send('Creating Category Failed')
    }
}

exports.list = async(req,res)=>{
    return res.json(await Category.find()
        .sort({createdAt:-1})
        .exec()
    )
}

exports.remove = async(req,res)=>{
    try{
        const deleted = await Category.findOneAndDelete({
            slug:req.params.slug
        })
        res.json(deleted)
    }catch(err){
        res.status(400).send('Deleting Category Failed')
    }
}

exports.update = async(req,res)=>{
    const {name} = req.body
    try{
        const update = await Category.findOneAndUpdate({
            slug:req.params.slug
        },{
            name,
            slug:slugify(name)
        },{
            new:true
        })
        res.json(update)
    }catch(err){
        res.status(400).send('Updating Category Failed')
    }
}

exports.read = async(req,res)=>{
    let category = await Category.findOne({
        slug:req.params.slug
    })
    .exec()
    res.json(category)
}