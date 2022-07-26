import '../../css/MenuPage.css';
import React from 'react';
import {useEffect, useState} from "react";
import {MediaService} from '../../services/services';
import {ClearHistory} from '../../services/services';
import {Divider, Video, Spinner} from './CommonElements';

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
        document.getElementById('history')
            .addEventListener('scroll',scrollHandler);
    },[])

    const scrollHandler=(e)=>{
        if(e.target.scrollHeight-(e.target.scrollTop+window.innerHeight)
            < 0.15*e.target.scrollHeight){
            setFetching(true);
        }   
    }

    const HandleClearHistory = async ()=>{
        await ClearHistory().then(resp=>{
            setVideos([]);
            });
    }
    return (
        <div className='wrapper' id='history'>
            <div className='wrapper' id='history'>
                {videos.length===0?
                <Spinner/>:
                videos.map((video)=>{
                    const extra = {setVideos,videos};
                    if(video.type==='divider')
                        return <Divider data={video.date} key={video.date}/>
                    else
                        return <Video video={video} type='history' extra={extra} key={video.index}/> 
                })}
            </div>
            <button className='clear_history' onClick={HandleClearHistory}>Clear History</button>
        </div>
    );
}

export default HistoryPanel;