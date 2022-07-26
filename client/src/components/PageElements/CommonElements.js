import {GetMediaImage, DeleteMediaDataWatch} from '../../services/services';
import React from 'react';
import {useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';

export function Video({video,type='video',extra=null}) {
    const navigator = useNavigate();
    const [cookie] = useCookies('data');
    function OpenVideo(){
        if(type==='edit'){
            if(extra===cookie.data.username)
                navigator(`/menu/my_panel/${video.index}`);
            else
                navigator(`/menu/watch/${video.index}`);
        }
        else{
            navigator(`/menu/watch/${video.index}`);
        }
    }
    async function DeleteWatch(index){
        await DeleteMediaDataWatch(index)
            .then(resp=>{
                if(resp.data.message==='Success')
                    extra.setVideos(extra.videos.filter(item=>item.index!==video.index))
            })
            .catch(err=>{console.log(err)});
    }
    return (
        <div className='video' key={video.index} id={video.index}>
            {type==='history'?<button className='delete_watch' onClick={()=>{DeleteWatch(video.index)}}>Delete</button>:null}
            <img src={GetMediaImage(video.path)} alt='' onClick={OpenVideo}/>
            <h3 className='video_name'>{video.name}</h3>
            <div className='extra'>
                <h4 className='video_author'>{video.owner}</h4>
                <h4 className='video_watched'>{video.watched} views</h4>
                <h4 className='video_time'>{video.time} ago</h4>
                <h4 className='video_likes'>likes: {video.likes}</h4>
            </div>
        </div>
    );
}

export function Mocker() {
    const navigator = useNavigate();
    function VisitMain(){
        navigator('/menu');
    }
    return (
        <div className='video'>
            <img src={GetMediaImage('replacer.png')} alt='' onClick={VisitMain}/>
            <h3>Check the videos</h3>
        </div>
    );
}

export function Divider({data}){
    return (
        <div className='divider'>
            <h2>{data}</h2>
        </div>
    )
}

export function Spinner(){
    return(
        <div className='spinner_wrapper'>
            <div className='spinner'>
            </div>
        </div>
    )
}

