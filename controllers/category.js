const category = require('../models/category')
const slugify = require('slugify')

exports.create = async(req,res)=>{
    try{
        const {name} = req.body
        const category = await new Category({
            name,
            slugify(name)
        })
        .save()
        res.json(category)
    }catch(err){
        res.status(400).send('Creating Category Failed')
    }
}

exports.list = async(req,res)=>{
    
}

exports.remove = async(req,res)=>{
    
}

exports.update = async(req,res)=>{
    
}

exports.read = async(req,res)=>{
    
}