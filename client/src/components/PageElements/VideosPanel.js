import '../../css/MenuPage.css';
import React from 'react';
import {useEffect, useState} from "react";
import {MediaService} from '../../services/services';
import {Video} from './CommonElements';
import {Spinner} from './CommonElements';

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
            {videos.length>0?
            <>
                {videos.map(video=>
                    <Video video={video} key={video.index}/>
                    )}
            </>:
            <Spinner/>}
            
        </div>
    );
}

export default VideosPanel;