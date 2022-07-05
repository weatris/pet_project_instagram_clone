import React, {useEffect, useState} from 'react';
import '../../css/MenuPage.css';
import { useParams } from "react-router-dom";
import {GetMediaData} from '../../services/services';
import {GetMediaImage} from '../../services/services';
import {MediaService} from '../../services/services';
import {HandleLikeService, HandleSubscribeService} from '../../services/services';
import {CreateComment,GetCommentsForMedia} from '../../services/services';
import {useNavigate} from "react-router-dom";

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

function Comment({data}){
    return (
        <div className='comment'>
            <h2 className='comment_user'>{data.username}</h2>
            <h3 className='comment_content'>{data.content}</h3>
        </div>
    )
}

function WatchPanel() {
    const {index} = useParams();
    const [videos, setVideos] = useState([]);
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [fetching,setFetching] = useState(true);
    const [showRecommend,setShowRecommend] = useState(false);
    const [showMore,setShowMore] = useState(false);
    const [mediaData,setMediaData] = useState({});
    
    const getWatchData = async()=>{
        await GetMediaData(index)
        .then(resp=>{
            setMediaData(resp.data);
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const getCommentsData = async()=>{
        await GetCommentsForMedia(index)
        .then(resp=>{
            setComments(resp.data.comments);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        getWatchData();
        getCommentsData();
        if(fetching){
            MediaService('media',page).then(resp=>{
                setVideos([...videos,...resp.data.images]);
                setPage(page+1);
            }).catch(err=>{
                console.log(err);
            }).finally(()=>
                {setFetching(false);})
        }
    },[index,fetching]);

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
                setMediaData({...mediaData,...{likes:resp.data.likes,
                                               is_subscribed:resp.data.is_subscribed}});
            }
        }).catch(e=>{
            console.log(e);
        })
    }

    const handleLike= async(e)=>{
        e.preventDefault();
        await HandleLikeService(index).then(resp=>{
            if(resp.data.message==='Success'){
                setMediaData({...mediaData,...{likes:resp.data.likes,
                                               is_liked:resp.data.is_liked}});
            }
        }).catch(e=>{
            console.log(e);
        })
    }

    const handleMore= async(e)=>{
        e.preventDefault();
        setShowMore(!showMore);
        getCommentsData();
    }

    const handleCreateComment = async (e)=>{
        e.preventDefault();
        const content = document.getElementById('content').value;
        await CreateComment(index,content).then(resp=>{
            getCommentsData();
        })
    }

    return (
        <div className="watch">
            <img id='display_recommendation' alt={''} onClick={()=>{setShowRecommend(!showRecommend)}} src={require('../../img/arrow.png')}></img>
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
                    <h4 id='views'>views : {mediaData.views}</h4>
                    <h4 id='likes'>likes : {mediaData.likes}</h4>
                </div>
                <div className='details'>
                    <div className='details_buttons'>
                        <button className={mediaData.is_liked?'like':'is_liked'} onClick={handleLike}>Like</button>
                        <button className= {mediaData.is_subscribed?'subscribe':'is_subscribed'} onClick={handleSubscribe}>Subscribe</button>
                        <button className='more' onClick={handleMore}>More</button>
                    </div>
                </div>
            </div>
            {showMore?
            <div className='details_panel'>
                <h1 className='title'>Details</h1>
                <img className="img" onClick={handleMore} src={require("../../img/cancel.png")} alt="alt"/>
                <div className='description'>
                        {mediaData.description} 
                </div>
                <div className='comments'>
                    <div className='create_comment'>
                        <input id='content'/>
                        <button onClick={handleCreateComment}>Submit</button>
                    </div>
                    {comments.map((elem,idx)=>
                        <Comment data={elem} key={idx}/>)}
                </div>
            </div>:null}
        </div>
    );
}

export default WatchPanel;