const express=require('express');
const router=express.Router();
const cartRepo=require('../Repositories/cart');
const productRepo=require('../Repositories/products');
const cartShowTemplate=require('../views/cart/showCart');

//receive a POST request to add item to cart
router.post('/cart/products',async (req,res)=>{
    let cart;
    if(!req.session.cartId){
          cart=await cartRepo.create({ items: [] });
          req.session.cartId=cart.id;
    }
    else{
        cart=await cartRepo.getById(req.session.cartId);

    }
    
    const existingItem=cart.items.find(item=>item.id === req.body.productId)
    if(existingItem){
        existingItem.quantity++;
    }
    else{
        cart.items.push({id:req.body.productId,quantity:1})
    }
   await cartRepo.update(cart.id,{items:cart.items});
   res.redirect('/cart/');
})

//receive GET req to show all items in cart

router.get('/cart/',async (req,res)=>{
    if(!req.session.cartId){
        return res.redirect('/');
    }
    const cart=await cartRepo.getById(req.session.cartId);
    for(let item of cart.items){
        const product=await productRepo.getById(item.id);
        item.product=product;
    }
    res.send(cartShowTemplate({items:cart.items}));
})

//receive a POST request to delete an item from the card
router.post('/cart/products/delete/',async (req,res)=>{
console.log(req.body.itemId);
 const {itemId}=req.body;
 const cart=await cartRepo.getById(req.session.cartId);
 const items=cart.items.filter(item=>item.id != itemId);
await cartRepo.update(req.session.cartId ,{items});
 res.redirect('/cart/');
})

module.exports=router;