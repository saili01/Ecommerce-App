const express=require('express');
const multer=require('multer');
const prodRepo=require('../../Repositories/products');
const newProductTemplate=require('../../views/admin/products/new');
const productIndexTemplate=require('../../views/admin/products/index');
const productEditTemplate=require('../../views/admin/products/edit');
const {requireTitle,requirePrice}=require('../admin/validator');
const {handleErrors,requireAuth}=require('./middleware');

const router=express.Router();
const upload=multer({storage:multer.memoryStorage()});

router.get('/admin/products',requireAuth,async (req,res)=>{
 const products= await prodRepo.getAll();
  res.send(productIndexTemplate({products}));
    
})

router.get('/admin/products/new',requireAuth,(req,res)=>{
    res.send(newProductTemplate({}))

});

router.post('/admin/products/new',requireAuth,upload.single('image'),[requireTitle,requirePrice],handleErrors(newProductTemplate),
 async (req,res)=>{
const image=req.file.buffer.toString('base64');
const {title,price}=req.body;
//console.log(req.file);
await prodRepo.create({title,price,image});
res.redirect('/admin/products')

})

router.get('/admin/products/:id/edit',requireAuth,async (req,res)=>{
    const product=await prodRepo.getById(req.params.id);
    console.log(product);
    if(!product){
        return res.send('Product Not found');
    }
    res.send(productEditTemplate({product}));
})

router.post('/admin/products/:id/edit',requireAuth,
upload.single('image'),
[requireTitle,requirePrice],
handleErrors(productEditTemplate,async req =>{
    const product=await prodRepo.getById(req.params.id);
    return {product};
}),
async (req,res)=>{
const change = req.body;
if(req.file){
    change.image=req.file.buffer.toString('base64');
}
try{
await prodRepo.update(req.params.id,change);
}
catch(err){
    return res.send('could not find item');
}
res.redirect('/admin/products/');
});

router.post('/admin/products/:id/delete/',requireAuth, async (req,res)=>{
    await prodRepo.delete(req.params.id);
    res.redirect('/admin/products/');
})
module.exports=router;