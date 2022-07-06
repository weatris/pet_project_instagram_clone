require("dotenv").config();
const {User} = require("../models");
const jwt = require('jsonwebtoken');
const MD5 = require("crypto-js/md5");

const MAX_TRIES = 3;

const Verify = (req,res,next)=>{
    try{
        const token = req.cookies.data;
        if(token){
            jwt.verify(token.accessToken,process.env.ACCESS_TOKEN_SECRET,(err)=>{
                if(err)
                    return res.status(401).send({message:'Invalid token'})
                else{
                    next();
                }
            })
        }
        else{
            res.send('Non authorized Access');
        }
    }catch(e){
        console.log(e);
        res.send({message:'Server Error'});
    }

}

const generateAccessToken=(user)=>{
    return jwt.sign(({username:user.username,role:user.role}),
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'12h'});
}

const Login = async (req, res)=>{
    try{
        await User.findOne({where:{username:req.body.username}})
            .then(async (user)=>{

                if(!user)
                    await res.send({message:'No such user!'});

                else if(user.tries>=MAX_TRIES)
                    await res.send({message:'Account blocked !'});

                else if(user.password!==MD5(req.body.password).toString()){
                    user.update({tries:user.tries+1})
                    await res.send({message:'Wrong password'});
                }
                else{
                    user.update({tries:0});
                    const accessToken = generateAccessToken(user);

                    if (!accessToken)
                        await res.send({message: 'something went wrong'});
                    else{
                        await res.cookie('data',{username:user.username, accessToken:accessToken}, {maxAge : 12*60*60})
                        await res.send({message:'Success'});
                    }
                        
                }
            })
    }
    catch (err){
        await res.send({message:'Error !'});
    }
}

const SignUp= async (req, res)=>{
    try{
        let username_user = await User.findOne({where:{username:req.body.username}});
        let email_user = await User.findOne({where:{email:req.body.email}});
        if(username_user)
            await res.send({message:'Username occupied'})

        else if(email_user)
            await res.send({message:'Email occupied'})

        else{
            const new_user = User.build( { username:req.body.username,
                password:MD5(req.body.password).toString(),
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                isAdmin:false,
                tries:0})
            await new_user.save();
            await res.send({message:'Success'});
        }
    }
    catch (err){
        await res.send({message:'Error !'})
    }
}

module.exports = {Login,SignUp,Verify};