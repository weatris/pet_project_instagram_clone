import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import {useNavigate, useParams} from "react-router-dom";
import { useCookies } from 'react-cookie';
import {CommentsService} from '../../services/services';
import {Spinner} from './CommonElements';

function Comment({data}){
    return (
        <div className='comment'>
            <h2 className='comment_user'>{data.username}</h2>
            <h3 className='comment_content'>{data.content}</h3>
        </div>
    )
}

function DetailsPanel ({setShowMore,mediaData}){
    const {index} = useParams();
    const navigator = useNavigate();
    const [commentInput,setCommentInput] = useState('');
    const socket = io.connect('http://localhost:7000/');
    const [comments, setComments] = useState([]);
    const [cookie] = useCookies('data');
    const [page, setPage] = useState(1);
    const [fetching,setFetching] = useState(true);


    useEffect(()=>{
        if(fetching){
            CommentsService(index,page).then(resp=>{
                setComments([...comments,...resp.data.comments]);
                setPage(page+1);
            }).catch(err=>{
                console.log(err);
            }).finally(()=>
                {setFetching(false);})
        }
        return () => { socket.disconnect() }
    },[fetching])

    const handleGetCreator=(e)=>{
        e.preventDefault();
        navigator(`/menu/user/${mediaData.username}`);
    }
    const handleCreateComment = (e)=>{
        e.preventDefault();
        setComments([]);
        setPage(1);
        setFetching(true);
        socket.emit('handle_comment',{index,content:commentInput,username:cookie.data.username});
    }
    const scrollHandler=(e)=>{
        if(e.target.scrollHeight-(e.target.scrollTop+window.innerHeight)
            < 0.15*e.target.scrollHeight){
            setFetching(true);
        }   
    }
    useEffect(()=>{
        socket.off(`comment_${index}`).on(`comment_${index}`,(resp)=>{
            if(resp.message==='Success')
                setComments(state=>[resp.data,...state]);
        })
        return () => { socket.disconnect() }
    },[socket]);
    return(
        <div className='media_details_panel'>
                <div className='background'></div>
                <div className='details_panel'>
                    <img className="img" onClick={()=>{setShowMore(false)}} src={require("../../img/cancel.png")} alt="alt"/>
                    <h1 className='title'>Details</h1>
                    <h2 className='username' onClick={handleGetCreator}>made by : {mediaData.username}</h2>
                    <div className='description'>{mediaData.description} </div>
                    <div className='comments' onScroll={scrollHandler}>
                        <div className='create_comment'>
                            <input id='content' onChange={e=>{setCommentInput(e.target.value)}}/>
                            <button onClick={handleCreateComment}>Submit</button>
                        </div>
                        {comments.length===0?
                            <Spinner/>:
                            <>
                                {comments.map((elem,idx)=>
                                    <Comment data={elem} key={idx}/>)}
                            </>}
                    </div>
                </div>
            </div>
    )
}

export default DetailsPanel;