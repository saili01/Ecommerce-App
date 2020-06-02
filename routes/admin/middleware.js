const {validationResult}=require('express-validator');

module.exports={
    handleErrors(templateFunc,dataCb){
        return async (req,res,next)=>{
         const error=validationResult(req);
         if(!error.isEmpty()){
             let data={}
             if(dataCb){
                 data=await dataCb(req);
             }
             return res.send(templateFunc({error, ...data}));
         }
         next();
        };
    },
    requireAuth(req,res,next){
        if(!req.session.userId){
            return res.redirect('/SignIn/');
        }
        next();
    }
};

