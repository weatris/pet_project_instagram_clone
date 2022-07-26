import React, {useEffect, useState} from 'react';
import '../../css/MenuPage.css';
import { useParams } from "react-router-dom";
import {GetMediaData} from '../../services/services';
import {GetMediaImage} from '../../services/services';
import {MediaService} from '../../services/services';
import {useNavigate} from "react-router-dom";
import io from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { HandleSubscribeService} from '../../services/services';
import {Spinner} from './CommonElements';
import DetailsPanel from './DetailsPanel';

function RecommendedVideo({data}){
    const navigator = useNavigate();
    function OpenVideo(){
        navigator(`/menu/watch/${data.index}`);
    }
    return (
        <div className='recommended' onClick={OpenVideo}>
            <img className='recommended_img' src={GetMediaImage(data.path)} alt={data.name}/>
            <h3>{data.name||'text'}</h3>
        </div>
    )
}

function capitalizeWords(arr) {
    return arr.map(element => {
      return element.charAt(0).toUpperCase() + element.substring(1).toLowerCase();
    }).join(' ');
  }

function WatchPanel() {
    const socket = io.connect('http://localhost:7000/');
    const {index} = useParams();
    const [isLoaded,setIsLoaded] = useState(false);
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [fetching,setFetching] = useState(true);
    const [showRecommend,setShowRecommend] = useState(false);
    const [showMore,setShowMore] = useState(false);
    const [mediaData,setMediaData] = useState({});
    const [cookie] = useCookies('data');

    const getWatchData = async()=>{
        await GetMediaData(index)
        .then(resp=>{
            setMediaData(resp.data);
            document.title = capitalizeWords((resp.data.name||'Cool video').split(' '));
            setIsLoaded(true);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        setIsLoaded(false);
        getWatchData();
        return () => { socket.disconnect() }
    },[index]);

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

    const scrollHandler=(e)=>{
        if(e.target.scrollHeight-(e.target.scrollTop+window.innerHeight)
            < 0.15*e.target.scrollHeight){
            setFetching(true);
        }   
    }

    const handleSubscribe= async(e)=>{
        e.preventDefault();
        await HandleSubscribeService(index).then(resp=>{
            if(resp.data.message==='Success'){
                setMediaData({...mediaData,...{is_subscribed:resp.data.is_subscribed}});
            }
        }).catch(e=>{
            console.log(e);
        })
    }

    const handleLike= async(e)=>{
        e.preventDefault();
        socket.emit('handle_like',{index,username:cookie.data.username});
    }
    const handleMore= (e)=>{
        e.preventDefault();
        setShowMore(!showMore);
    }

    useEffect(()=>{
        socket.off(`like_${index}`).on(`like_${index}`,(resp)=>{
            if(resp.message==='Success'){
                const data = resp.hasOwnProperty('is_liked')?{likes:resp.likes,is_liked:resp.is_liked}:{likes:resp.likes};
                setMediaData(state=>{return{...state,...data}});
            } 
        })
        return () => { socket.disconnect() }
    },[socket]);

    return (
        <div className="watch">
            <img id='display_recommendation' alt={''} onClick={()=>{setShowRecommend(!showRecommend)}} src={require('../../img/arrow.png')}></img>
            {isLoaded?
                <>
                <div id='main'>
                    <div className='content'>
                        <img id='watched' src={GetMediaImage(mediaData.path)} alt='content'/>
                    </div>
                    <div className={showRecommend?'recommendation':'recommendation shown'} onScroll={scrollHandler}>
                        {videos.map(data=>
                            <RecommendedVideo data={data} key={data.index}/>
                            )}
                    </div>
                </div>
                <div id='data'>
                    <div id='info'>
                        <h2 id='name'>{mediaData.name||'name'}</h2>
                        <h4 id='time'>{mediaData.time} ago</h4>
                        <h4 id='views'>views : {mediaData.views||0}</h4>
                        <h4 id='likes'>likes : {mediaData.likes||0}</h4>
                    </div>
                    <div className='details'>
                        <div className='details_buttons'>
                            <button className={mediaData.is_liked?'like':'is_liked'} onClick={handleLike}>Like</button>
                            <button className= {mediaData.is_subscribed?'subscribe':'is_subscribed'} onClick={handleSubscribe}>Subscribe</button>
                            <button className='more' onClick={handleMore}>More</button>
                        </div>
                    </div>
                </div>
                </>
                :<Spinner/>}

            {showMore?
            <DetailsPanel mediaData={mediaData} setShowMore={setShowMore}/>
            :null}
            </div>
        );
}

export default WatchPanel;