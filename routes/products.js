const express=require('express');
const router=express.Router();
const prodRepo=require('../Repositories/products');
const prodIndexTemplate=require('../views/Products/index');

router.get('/',async (req,res)=>{
   const products=await prodRepo.getAll();
   res.send(prodIndexTemplate({products}));
})

module.exports=router;