const { Media, User, History, Like, Comment, Op, Subscription, Notification } = require('../models/index');
const {Sequelize} = require('sequelize') 
const {timeSince} = require('./helper');

const methods = {
    media: async(req)=>{  
        const pageParam = Number(req.params.page);
        const limitParam = 20;
        const offsetParam = (pageParam - 1) * limitParam;
        const media = await Media.findAll({limit:limitParam,offset:offsetParam,order:[['creation_time','desc']]});
        
        for await (item of media){
            const buf = await History.findAll({where:{media_id:item.id}});
            const likes = await Like.findAll({where:{media_id:item.id}});
            const owner = await User.findOne({where:{id:item.user_id}});
            item.time = timeSince(item.creation_time);
            item.watched = buf.length;
            item.owner = owner.username;
            item.likes = likes.length;
        }

        const data = media.map(item=>
            {return {index:item.index,path:item.path,name:item.name,watched:item.watched,owner:item.owner,time:item.time,likes:item.likes}});
        return data;
    },
    history: async(req)=>{
        const pageParam = Number(req.params.page);
        const limitParam = 20;
        const offsetParam = (pageParam - 1) * limitParam;

        const user = await User.findOne({where:{username:req.cookies.data.username}});
        const history = await History.findAll({where:{user_id:user.id},limit:limitParam,offset:offsetParam,order:[['watched_time','desc']]});

        let media = await Media.findAll({where:{id:history.map(item=>item.media_id)}});
        media.forEach(obj => {
            const item = history.filter(item=>item.media_id===obj.id);
            obj.watched_time = item[0].watched_time;
        });
        for await (item of media){
            const buf = await History.findAll({where:{media_id:item.id}});
            const likes = await Like.findAll({where:{media_id:item.id}});
            const owner = await User.findOne({where:{id:item.user_id}});
            item.time = timeSince(item.creation_time);
            item.watched = buf.length;
            item.owner = owner.username;
            item.likes = likes.length;
        }

        const data = media.map(item=>
            {return {index:item.index,path:item.path,name:item.name,date:item.watched_time,watched:item.watched,owner:item.owner,time:item.time,likes:item.likes}});
        return data;
    },
    user_media: async(req)=>{
        const pageParam = Number(req.params.page);
        const limitParam = 20;
        const offsetParam = (pageParam - 1) * limitParam;

        const user = await User.findOne({where:{username:req.cookies.data.username}});
        const media = await Media.findAll({where:{user_id:user.id},limit:limitParam,offset:offsetParam,order:[['creation_time','desc']]});
        
        for await (item of media){
            const buf = await History.findAll({where:{media_id:item.id}});
            const likes = await Like.findAll({where:{media_id:item.id}});
            item.time = timeSince(item.creation_time);
            item.watched = buf.length;
            item.likes = likes.length;
        }

        const data = media.map(item=>
            {return {index:item.index,path:item.path,watched:item.watched,name:item.name,date:item.creation_time,likes:item.likes, time:item.time}});
        return data;
    },
    search: async(req)=>{
        const pageParam = Number(req.params.page);
        const limitParam = 20;
        const offsetParam = (pageParam - 1) * limitParam;
        const user = await User.findOne({where:{username:{[Op.like]:`%${req.params.search_param}%`}}});
        const md = await Media.findAll();
        const length = md.length;
        const arr = Array.from({length:15}, () => Math.floor(Math.random() * length));
        const media = await Media.findAll({ limit:limitParam,
                                            offset:offsetParam,
                                            where:
                                                Sequelize.or(
                                                    {name:{[Op.like]:`%${req.params.search_param}%`}},
                                                    {description:{[Op.like]:`%${req.params.search_param}%`}},
                                                    {user_id:!!user?user.id:0},
                                                    {id : arr}
                                                ),
                                            order:[['creation_time','desc']]});

        for await (item of media){
            const buf = await History.findAll({where:{media_id:item.id}});
            const likes = await Like.findAll({where:{media_id:item.id}});
            const owner = await User.findOne({where:{id:item.user_id}});
            item.time = timeSince(item.creation_time);
            item.watched = buf.length;
            item.owner = owner.username;
            item.likes = likes.length;
        }

        const data = media.map(item=>
            {return {index:item.index,path:item.path,name:item.name,watched:item.watched,owner:item.owner,time:item.time,likes:item.likes}});
        return data;
    },
    notification: async(req)=>{  
        const pageParam = Number(req.params.page);
        const limitParam = 20;
        const offsetParam = (pageParam - 1) * limitParam;
        const user = await User.findOne({where:{username:req.cookies.data.username}});
        const user_notifications = await Notification.findAll({where:{user_id:user.id}});
        const media_ids = user_notifications.map(item=>item.media_id);
        const media = await Media.findAll({limit:limitParam,offset:offsetParam,order:[['creation_time','desc']],where:{id:media_ids}});
        
        for await (item of media){
            const buf = await History.findAll({where:{media_id:item.id}});
            const likes = await Like.findAll({where:{media_id:item.id}});
            const owner = await User.findOne({where:{id:item.user_id}});
            item.time = timeSince(item.creation_time);
            item.watched = buf.length;
            item.owner = owner.username;
            item.likes = likes.length;
        }

        const data = media.map(item=>
            {return {index:item.index,
                    path:item.path,
                    name:item.name,
                    watched:item.watched,
                    owner:item.owner,
                    time:item.time,
                    likes:item.likes}});
        return data;
    },
}

const GetAllMedia = async (req,res) => {
    try{
        const images = await methods[req.params.type](req);
        
        res.send({message:'Success',images});
    } catch(e){
        console.log(e);
        res.send({message:'Error !'});
    }
}

const WatchMedia = async (req,res) => {
    try{
        const user = await User.findOne({where:{username:req.cookies.data.username}});
        const media = await Media.findOne({where:{index:req.params.index}});
        const history = await History.findOne({where:{user_id:user.id,media_id:media.id}});
        const notification  = await Notification.findOne({where:{user_id:user.id,media_id:media.id}});
        if(notification)
            notification.destroy();
        if(history)
            history.update({watched_time: new  Date()});
        else{
            const watch = History.build({user_id:user.id,media_id:media.id,watched_time:new Date()});
            await watch.save();
        }
        const views = await History.findAll({where:{media_id:media.id}});
        const all_likes = await Like.findAll({where:{media_id:media.id}});
        const is_liked = await Like.findOne({where:{user_id:user.id,media_id:media.id}});
        res.send({path:media.path,
                     name:media.name,
                      description:media.description,
                      views:views.length,
                      time:timeSince(media.creation_time),
                      is_liked:!!!is_liked,
                      likes:all_likes.length});
    } catch(e){
        console.log(e);
        res.send({message:'Error !'});
    }
}

const DeleteWatchMedia = async (req,res) => {
    try{
        const user = await User.findOne({where:{username:req.cookies.data.username}});
        const media = await Media.findOne({where:{index:req.params.index}});
        await History.destroy({where:{user_id:user.id,media_id:media.id}});
        
        res.send({message:'Success'});
    } catch(e){
        console.log(e);
        res.send({message:'Error !'});
    }
}

const ClearHistory = async (req,res) => {
    try{
        const user = await User.findOne({where:{username:req.cookies.data.username}});
        await History.destroy({where:{user_id:user.id}})
        res.send({message:'Success'});
    } catch(e){
        console.log(e);
        res.send({message:'Error !'});
    }
}

const UpdateMedia = async (req,res) => {
    try{
        await Media.update(
                {name:req.body.name,
                description:req.body.description},
            {where:{index:req.params.index}});
        res.send({message:'Success'});
    } catch(e){
        console.log(e);
        res.send({message:'Error !'});
    }
}

const DeleteMedia = async (req,res) => {
    try{
        //await Media.destroy({where:{index:req.params.index}});
        res.send({message:'Success'});
    } catch(e){
        console.log(e);
        res.send({message:'Error !'});
    }
}

const HandleLike = async (req,res) =>{
    try{
        const media = await Media.findOne({where:{index:req.params.index}});
        const user = await User.findOne({where:{username:req.cookies.data.username}});
        const like = await Like.findOne({where:{user_id:user.id,media_id:media.id}});
        if(like){
            await Like.destroy({where:{user_id:user.id,media_id:media.id}});
        }
        else{
            await Like.build({user_id:user.id,media_id:media.id,creation_time:new  Date()}).save();
        }
        const all_likes = await Like.findAll({where:{media_id:media.id}});
        res.send({message:'Success',likes:all_likes.length,is_liked:!!like});
    }
    catch(e){
        console.log(e);
        res.send({message:'Error !'});
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
        res.send({message:'Success',is_subscribed:!!check});
    }
    catch(e){
        console.log(e);
        res.send({message:'Error !'});
    }
}

const HandleComment = async (req,res)=>{
    try{
        const media = await Media.findOne({where:{index:req.params.index}});
        const user = await User.findOne({where:{username:req.cookies.data.username}});
        const {content} = req.body;
        await Comment.build({content:content,
                            media_id:media.id,
                            user_id:user.id,
                            creation_time:new  Date()}).save();
        res.send({message:'Success'});                    
    }
    catch(e){
        console.log(e);
        res.send({message:'Error !'});
    }
}

const GetComments=async(req,res)=>{
    const media = await Media.findOne({where:{index:req.params.index}});
    let comments = await Comment.findAll({where:{media_id:media.id},order:[['creation_time','desc']]});
    for await (item of comments){
        const owner = await User.findOne({where:{id:item.user_id}});
        item.time = timeSince(item.creation_time);
        item.username = owner.username;
    }
    const data = comments.map(item=>
        {return {content:item.content,time:item.time,username:item.username}});
    res.send({message:'Success',comments:data});
}

const GetAllSearchedMedia = async (req,res) => {
    try{
        const images = await methods[req.params.type](req);
        
        res.send({message:'Success',images});
    } catch(e){
        console.log(e);
        res.send({message:'Error !'});
    }
}

module.exports = {  WatchMedia,
                    GetAllMedia,
                    DeleteWatchMedia,
                    ClearHistory,
                    UpdateMedia,
                    DeleteMedia,
                    HandleLike,
                    HandleComment,
                    GetComments,
                    GetAllSearchedMedia,
                    HandleSubscribe };