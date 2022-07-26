const { Media, User, History, Like, Subscription } = require('../models/index');
const {compareTime} = require('./helper');

const DeleteWatchMedia = async (req,res) => {
    try{
        const user = await User.findOne({where:{username:req.cookies.data.username}});
        const media = await Media.findOne({where:{index:req.params.index}});
        await History.destroy({where:{user_id:user.id,media_id:media.id}});
        
        await res.send({message:'Success'});
    } catch(e){
        console.log(e);
        await res.send({message:'Error !'});
    }
}

const ClearHistory = async (req,res) => {
    try{
        const user = await User.findOne({where:{username:req.cookies.data.username}});
        await History.destroy({where:{user_id:user.id}})
        await res.send({message:'Success'});
    } catch(e){
        console.log(e);
        await res.send({message:'Error !'});
    }
}

const UpdateMedia = async (req,res) => {
    try{
        await Media.update(
                {name:req.body.name,
                description:req.body.description},
            {where:{index:req.params.index}});
            await res.send({message:'Success'});
    } catch(e){
        console.log(e);
        await res.send({message:'Error !'});
    }
}

const DeleteMedia = async (req,res) => {
    try{
        await Media.destroy({where:{index:req.params.index}});
        await res.send({message:'Success'});
    } catch(e){
        console.log(e);
        await res.send({message:'Error !'});
    }
}

const GetUserData = async (req,res)=>{
    try{
        const user = await User.findOne({where:{username:req.body.username}});
        const subscribers = await Subscription.findAll({where:{content_creator:user.id}});
        const user_media = await Media.findAll({where:{user_id:user.id}});
        const likes_for_user_media = await Like.findAll({where:{media_id:user_media.map(item=>item.id)}});
        const likes_count = [];
        
        likes_for_user_media.map(element => {
            const date = element.creation_time.toISOString().split('T')[0];
            const idx = likes_count.findIndex(elem=>elem.date===date);
            if(idx!==-1)
                likes_count[idx].likes = likes_count[idx].likes + 1;
            else
                likes_count.push({'date':date,likes:1});
        }); 

        const views_count = [];
        const views_for_user_media = await History.findAll({where:{media_id:user_media.map(item=>item.id)}});
        views_for_user_media.map(element => {
            const date = element.watched_time.toISOString().split('T')[0];
            const idx = views_count.findIndex(elem=>elem.date===date);
            if(idx!==-1)
                views_count[idx].views = views_count[idx].views + 1;
            else
                views_count.push({'date':date,views:1});
        }); 
        await res.send({message:'Success',
                        subscribers:subscribers.length,
                        username:user.username,
                        description:user.description,
                        likes:likes_count.sort(compareTime),
                        views:views_count.sort(compareTime)});
    }
    catch(e){
        console.log(e);
        await res.send({message:'Error'});
    }
}

module.exports = {  DeleteWatchMedia,
                    ClearHistory,
                    UpdateMedia,
                    DeleteMedia,
                    GetUserData };