import '../../css/MenuPage.css';
import React from 'react';
import {useEffect, useState} from "react";
import {MediaService} from '../../services/services';
import {useNavigate} from "react-router-dom";
import {GetMediaImage, DeleteMediaDataWatch, ClearHistory} from '../../services/services';

function HistoryPanel() {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [fetching,setFetching] = useState(true)

    useEffect(()=>{
        if(fetching){
            MediaService('history',page).then(resp=>{
                const buf = resp.data.images;
                buf.sort((a,b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime());
                buf.map(element => {element.date = element.date.split('T')[0]} );
                let i=1;
    
                while(i<buf.length){
                    if(buf[i-1].date!==buf[i].date)
                        buf.splice(i,0,{date:buf[i].date,type:'divider'});
                    i++;
                }
                setPage(page+1);
                setVideos([...videos,...buf]);
            }).catch(err=>{
                console.log(err);
            }).finally(()=>{
                setFetching(false);})
        }
    },[fetching]);

    useEffect(()=>{
        document.getElementById('videos')
            .addEventListener('scroll',scrollHandler);
    },[])

    const scrollHandler=(e)=>{
        if(e.target.scrollHeight-(e.target.scrollTop+window.innerHeight)
            < 0.15*e.target.scrollHeight){
            setFetching(true);
        }   
    }

    function Video({video}) {
        const navigator = useNavigate();
        function OpenVideo(){
            navigator(`/menu/watch/${video.index}`);
        }
        async function DeleteWatch(data){
            await DeleteMediaDataWatch(video.index)
                .then(resp=>{
                    setVideos(videos.filter(item=>item.index!==video.index))
                })
                .catch(err=>{console.log(err)});
        }
        return (
            <div className='video' key={video.index} id={video.index}>
                <button className='delete_watch' onClick={()=>{DeleteWatch(video.index)}}>Delete</button>
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

    function Mocker() {
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

    function Divider({data}){
        return (
            <div className='divider'>{data}</div>
        )
    }

    const HandleClearHistory = async ()=>{
        await ClearHistory().then(resp=>{
            setVideos([]);
            });
    }
    return (
        <div className='wrapper' id='videos'>
            <div className='wrapper' id='history'>
                {videos.length===0?
                <Mocker/>:
                videos.map((video)=>{
                    if(video.type==='divider')
                        return <Divider data={video.date} key={video.date}/>
                    else
                        return <Video video={video} key={video.index}/>
                    
                }
                    
                )}
            </div>
            <button className='clear_history' onClick={HandleClearHistory}>Clear History</button>
        </div>
    );
}

export default HistoryPanel;