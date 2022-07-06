require("dotenv").config();
const {User} = require('../models/index')
const {transport} = require('../email/email');
const jwt = require("jsonwebtoken");
const MD5 = require("crypto-js/md5");

const ForgotPassword = async (req, res)=>{
    try{
        await User.findOne({where:{email:req.body.email}})
            .then(async user => {
                if (!user){
                    await res.send({message: 'No such user!'});
                    return;
                }
                const recoveryToken = jwt.sign({username:user.username,
                                                     email:user.email},
                    process.env.ACCESS_TOKEN_SECRET+user.password,
                    {expiresIn:'15m'});
                const message = {
                    from: "frostwolfatris@gmail.com",
                    to: user.email,
                    subject: 'Account recovery',
                    text: 'Visit this to recover account : \n' +
                        ` http://localhost:3000/recover/${user.id}/${recoveryToken}`
                }
                await transport.sendMail(message);
                await res.cookie('auth',{email: user.email, recoveryToken: recoveryToken}, {maxAge : 15*60});
                await res.send({message: 'Success'});
            });
    }
    catch (err){
        console.log(err);
        return res.send({message:'Error'});
    }
}

const RecoverPassword = async (req, res)=>{
    try {
        const {email,token} = req.params;
        if(token){
            await User.findOne({where:{email:email}})
                .then(async (user) => {
                    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET+user.password,async (err, data) => {
                        if (err) {
                            await res.send({message: 'Invalid Token'});
                        } else {
                            user.update({password: MD5(req.body.password).toString()});
                            user.update({tries: 0});
                            let message = {
                                from: "frostwolfatris@gmail.com",
                                to: user.email,
                                subject: 'Account recovery',
                                text: 'Your password was changed. If it`s not you - visit : \n' +
                                    ` http://localhost:3000/forgot`
                            }
                            await transport.sendMail(message);
                            return res.send({message: 'Success'});
                        }
                    })
                })
        }
        else{
            await res.send({message:'Authentication error !'});
        }
    }
    catch (err){
        await res.send({message:'Error !'});
    }
}


module.exports = {ForgotPassword,RecoverPassword}
