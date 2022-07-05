import '../../css/MenuPage.css';
import React from 'react';
import {useEffect, useState} from "react";
import {MediaService} from '../../services/services';
import {useNavigate} from "react-router-dom";
import {GetMediaImage} from '../../services/services';

function Video({video}) {
    const navigator = useNavigate();
    function OpenVideo(){
        navigator(`/menu/watch/${video.index}`);
    }
    return (
        <div className='video' key={video.index} id={video.index}>
            <h3 className='video_name'>{video.name||'name'}</h3>
            <img src={GetMediaImage(video.path)} alt='' onClick={OpenVideo}/>
            <div className='extra'>
                <h4 className='video_author'>{video.owner}</h4>
                <h4 className='video_watched'>{video.watched} views</h4>
                <h4 className='video_time'>{video.time} ago</h4>
                <h4 className='video_likes'>likes: {video.likes}</h4>
            </div>
        </div>
    );
}

function VideosPanel() {

    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [fetching,setFetching] = useState(true);


    useEffect(()=>{
        if(fetching){
            MediaService('media',page).then(resp=>{
                setVideos([...videos,...resp.data.images]);
                setPage(page+1);
            }).catch(err=>{
                console.log(err);
            }).finally(()=>
                {setFetching(false);})
        }
    },[fetching]);

    useEffect(()=>{
        document.getElementById('videos')
            .addEventListener('scroll',scrollHandler);
    },[])

const scrollHandler=(e)=>{
    if(e.target.scrollHeight-(e.target.scrollTop+window.innerHeight)
        < 0.25*e.target.scrollHeight){
        setFetching(true);
    }   
}

    return (
        <div className='wrapper' id='videos'>
            {videos.map(video=>
                <Video video={video} key={video.index}/>
                )}
        </div>
    );
}

export default VideosPanel;