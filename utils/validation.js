const Joi=require('joi');
const SignupSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
   
   
});
const signinSchema=Joi.object({
    email:Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

module.exports={SignupSchema,signinSchema}
