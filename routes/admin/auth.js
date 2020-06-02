const express=require('express');
const userRepo=require('../../Repositories/users');
const signupTemplate=require('../../views/admin/auth/signup');
const signinTemplate=require('../../views/admin/auth/signin');
const {requireEmail,requirePassword,requirePasswordConfirmation,requireEmailexists,requirePasswordMatch}=require('./validator')
const {handleErrors}=require('./middleware');

const router=express.Router();



//This is the middleware function which helps to parse the form data before route handling takes place. 'next()' is the callback 
//function called when parsing data is completed or request method is not 'POST'
// const bodyParser=(req,res,next)=>{
//     if(req.method === 'POST'){
//     req.on('data',data=>{
//         const parsed=data.toString('utf8').split('&'); //data received is in hex decimal format so need to be converted to string
//         const formData={};
//         for(let pair of parsed){
//             const [key,value]=pair.split('=');
//             formData[key]=value;
//         }
//         req.body=formData;       //request object has a property called body
//         next();
//     })
// }
//     else{
//         next();
//     }
// }

router.get('/SignUp',(req,res)=>{
    
     res.send(signupTemplate({req}));
});

router.post('/SignUp',
[requireEmail,requirePassword,requirePasswordConfirmation],handleErrors(signupTemplate),
async (req,res)=>{
    const {email,password}=req.body;
    const user=await userRepo.createUser({email,password});
    req.session.userId=user.id;  //'session is a property of cookie library
    res.redirect('/admin/products')

    
})

router.get('/SignOut',(req,res)=>{
    req.session=null;
    res.send('You have signed out successfully');
})

router.get('/SignIn',(req,res)=>{
    res.send(signinTemplate({}));
})

router.post('/SignIn',[requireEmailexists,requirePasswordMatch],handleErrors(signinTemplate),
async (req,res)=>{
    const {email}=req.body;
    //Need to check if email provided matches with the one in our record
    const user=await userRepo.getOneBy({email}); 
   
    req.session.userId=user.id;
    res.redirect('/admin/products')
});
module.exports=router;