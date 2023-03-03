import db from '../models/index.js'
const user={
checktoken:async ( req,res,next)=>{
    const {token,id}=req.body;
const token2 =await db['resetToken'].findOne({owner:id})
if(!token||!id)throw Error("token or id parameter not passed");
if(!token2)throw Error("link expired");
if(token==token2.token){
    
    next();
}
else{
    throw Error("wrong token")
}
    
}

}
export default user;