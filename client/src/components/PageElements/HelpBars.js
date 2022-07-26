import '../../css/MenuPage.css';
import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';
import {useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import {MediaService} from '../../services/services';
import {GetMediaImage} from '../../services/services';

function Video({video,func}) {
    const navigator = useNavigate();
    function OpenVideo(){
        func(false);
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

function HelpBars() {
    const {search_param} = useParams();
    const [cookie, , removeCookie] = useCookies('data');
    const navigator = useNavigate();
    const [username,setUsername] = useState('user');
    const [searchParam,setSearchParam] = useState('');
    const [showMore,setShowMore] = useState(false);
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [fetching,setFetching] = useState(true);
    
    useEffect(()=>{
        if(!showMore){
            setVideos([]);
            setFetching(true);
            setPage(1);
        }
    },[showMore]);

    useEffect(()=>{
        if(fetching){
            MediaService('notification',page).then(resp=>{
                setVideos(resp.data.images);
                setPage(page+1);
            }).catch(err=>{
                console.log(err);
            }).finally(()=>{
                setFetching(false);
            })
        }
    },[fetching]);

    useEffect(()=>{
        document.getElementById('notifications')
            .addEventListener('scroll',scrollHandler);
    },[])

const scrollHandler=(e)=>{
    if(e.target.scrollHeight-(e.target.scrollTop+window.innerHeight)
        < 0.25*e.target.scrollHeight){
        setFetching(true);
    }   
}
    const Leave = (e)=>{
        e.preventDefault();
        removeCookie('data',{path:'/'});
        navigator("/");
    }
    useEffect(()=>{
        try{
            setUsername(cookie.data.username);
        }
        catch {
            navigator("/"); 
        }     
    })
    const HandleSearch = (e)=>{
        e.preventDefault();
        setSearchParam(state=>state.trim());
        if(searchParam!=='')
            navigator(`/menu/search/${searchParam}`);
    }
    return (
        <div>
            <nav className='navbar'>
                <input onChange={e=>setSearchParam(e.target.value)} value={search_param}/>
                <button onClick={HandleSearch}>Search</button>
            </nav>
            <input type="checkbox" id="check"/>
            <label htmlFor="check">
                <img id='open' className="img" src={require('../../img/tab.png')} alt="alt"/>
                <img id='close' className="img" src={require("../../img/cancel.png")} alt="alt"/>
            </label>
            <img id='notifications' className="img" src={require('../../img/tab.png')} alt="alt" onClick={()=>{setShowMore(!showMore)}}/>
            <div className="sidebar">
                <header>{username}</header>
                <Link to='/menu'>Media</Link>
                <Link to={`/menu/user/${username}`}>Me</Link>
                <Link to='/menu/history'>History</Link>
                <Link to='/menu/upload'>Upload</Link>
                <a href='/#' onClick={Leave}>Leave</a>
            </div>
            {showMore?
            <div className='details_panel'>
                <img className="img" onClick={()=>{setShowMore(false)}} src={require("../../img/cancel.png")} alt="alt"/>
                <h1 className='title'>Details</h1>
                <div className='wrapper'>
                    {videos.map(video=>
                        <Video video={video} key={video.index} func={setShowMore}/>
                    )}
                </div>
            </div>:null}
        </div>
    );
}

export default HelpBars;
