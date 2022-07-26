const multer = require("multer");
const { Media, User, Notification, Subscription } = require('../models');

const generate_index=()=>{
    let res ='';
    const signs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const len = 12;

    for(let i=0;i<len;i++)
        res += signs.charAt(Math.floor( Math.random() * signs.length ));
    return res;
}

const multerConfig = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null,'media/');
    },
    filename: async (req, file, callback)=>{
        try{
            const owner = await User.findOne({where:{username:req.cookies.data.username}});

            let test_index = generate_index();

            const new_media = await Media.build({
                description:req.body.description,
                index:test_index,
                name:req.body.name,
                user_id:owner.id,
                creation_time:new  Date()
            });
            await new_media.save();
            const ext = file.mimetype.split('/')[1];
            const name = `${new_media.id}_${owner.id}`;
            
            await new_media.update({path:`${name}.${ext}`});

            const user = await User.findOne({where:{username:req.cookies.data.username}});
            const subscribers = await Subscription.findAll({where:{content_creator:user.id}});

            for await (const subscriber of subscribers){
                await Notification.build({media_id:new_media.id,user_id:subscriber.subscriber}).save();
            }
            callback(null, `${name}.${ext}`);
        } catch(e){
            console.log(e);
            callback(null,'');
        }
    }
});

const isImage = (req, file, callback)=>{
    if(file.mimetype.startsWith('image'))
        callback(null,true);
    else
        callback(null,false);    
}

const upload = multer({
    storage:multerConfig,
    fileFilter:isImage
})

exports.UploadImage = upload.single('photo');

exports.upload = async (req, res)=>{
    try {
        await res.send({message:'Success'});
    }
    catch (err){
        console.log(err);
        res.send({message:'Error !'})
    }
}