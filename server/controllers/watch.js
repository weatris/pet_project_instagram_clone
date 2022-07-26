const { Media, User, Like, Comment,  Subscription } = require('../models/index');
const {timeSince} = require('./helper');

const HandleLike = async (data,socket) =>{
    try{
        const media = await Media.findOne({where:{index:data.index}});
        const user = await User.findOne({where:{username:data.username}});
        const like = await Like.findOne({where:{user_id:user.id,media_id:media.id}});
        if(like){
            await Like.destroy({where:{user_id:user.id,media_id:media.id}});
        }
        else{
            await Like.build({user_id:user.id,media_id:media.id,creation_time:new  Date()}).save();
        }
        const all_likes = await Like.findAll({where:{media_id:media.id}});

        socket.emit(`like_${data.index}`,{message:'Success',likes:all_likes.length,is_liked:!!like});
        socket.broadcast.emit(`like_${data.index}`,{message:'Success',likes:all_likes.length}); 
    }
    catch(e){
        console.log(e);
        socket.to(data.index).emit(`like_${data.index}`,'Error'); 
    }
}

const HandleSubscribe = async (req,res) =>{
    try{
        const media = await Media.findOne({where:{index:req.params.index}});
        const subscriber = await User.findOne({where:{username:req.cookies.data.username}});
        const user = await User.findOne({where:{id:media.user_id}});
        const check = await Subscription.findOne({where:{content_creator:user.id,subscriber:subscriber.id}});
        if(check){
            await Subscription.destroy({where:{content_creator:user.id,subscriber:subscriber.id}});
        }
        else{
            await Subscription.build({content_creator:user.id,subscriber:subscriber.id,creation_time:new  Date()}).save();
        }
        await res.send({message:'Success',is_subscribed:!!check});
    }
    catch(e){
        console.log(e);
        await res.send({message:'Error !'});
    }
}

const HandleComment = async (data,socket)=>{
    try{
        const media = await Media.findOne({where:{index:data.index}});
        const user = await User.findOne({where:{username:data.username}});
        const comment = await Comment.build({content:data.content,
                            media_id:media.id,
                            user_id:user.id,
                            creation_time:new  Date()}).save();  

        socket.emit(`comment_${data.index}`,{message:'Success',data:{content:data.content,time:comment.creation_time,username:user.username}})    
        socket.broadcast.emit(`comment_${data.index}`,{message:'Success',data:{content:data.content,time:comment.creation_time,username:user.username}})                                     
    }
    catch(e){
        console.log(e);
        socket.emit(`comment_${data.index}`,'Error')    
    }
}

const GetComments=async(req,res)=>{
    const pageParam = Number(req.params.page);
    const limitParam = 10;
    const offsetParam = (pageParam - 1) * limitParam;

    const media = await Media.findOne({where:{index:req.params.index}});
    let comments = await Comment.findAll({limit:limitParam,offset:offsetParam,where:{media_id:media.id},order:[['creation_time','desc']]});

    for await (item of comments){
        const owner = await User.findOne({where:{id:item.user_id}});
        item.time = timeSince(item.creation_time);
        item.username = owner.username;
    }
    const data = comments.map(item=>
        {return {content:item.content,time:item.time,username:item.username}});
    await res.send({message:'Success',comments:data});
}

module.exports = {HandleLike,HandleSubscribe,HandleComment,GetComments}