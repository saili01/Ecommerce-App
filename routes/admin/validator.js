const {check}=require('express-validator')
const userRepo=require('../../Repositories/users');

module.exports={
    requireTitle:check('title')
    .trim()
    .isLength({min:4, max:30})
    .withMessage('Title should be between length 4 and 20'),
    requirePrice:check('price')
    .trim()
    .toFloat()
    .isFloat({min:1})
    .withMessage('Price should be atleast 1'),
    requireEmail:check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid Email')
    .custom(async email=>{
        const existingUser=await userRepo.getOneBy({email});
        if(existingUser){
           throw new Error('Email is already in use');
        }
    }),

    requirePassword: check('password')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('Password length is not valid'),
   
    requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
        
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match');
      }
      else{
          return true;
      }
    }),

    requireEmailexists:  check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email entered does not exist')
    .custom(async (email)=>{
        const user=await userRepo.getOneBy({email});
        if(!user){
           throw new Error('Email not found');
        }
    }),

    requirePasswordMatch:check('password')
    .trim()
    .custom(async(password,{req})=>{
        const user=await userRepo.getOneBy({email:req.body.email})
        if(!user){
            throw new Error('Invalid Password');
        }
        const validPasswordCheck=await userRepo.comparePass(user.password,password);
        if(!validPasswordCheck){
            throw new Error('Password entered is incorrect. Please enter correct password');
        }
    })

}