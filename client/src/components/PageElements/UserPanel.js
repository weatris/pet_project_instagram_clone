import '../../css/MenuPage.css';
import React from 'react';
import {useEffect, useState} from "react";
import {MediaService,GetUserData} from '../../services/services';
import {useParams} from "react-router-dom";
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import EditUserPanel from './EditUserPanel';
import { useCookies } from 'react-cookie';
import {Divider, Video, Spinner} from './CommonElements';

function UserPanel() {
    const [videos, setVideos] = useState([]);
    const [showEditUser,setShowEditUser] = useState(false);
    const [page, setPage] = useState(1);
    const [cookie] = useCookies('data');
    const [fetching,setFetching] = useState(true);
    const[userData,setUserData] = useState({username:'',subscribers:1,description:''});
    const { username } = useParams();

    useEffect(()=>{
        document.getElementById('my_videos')
            .addEventListener('scroll',scrollHandler);
        GetUserData(username)
        .then(resp=>{
            setUserData({...userData,
                            username:resp.data.username,
                            subscribers:resp.data.subscribers,
                            description:resp.data.description||'',
                            likes:resp.data.likes,
                            views:resp.data.views});
            setVideos([]);
            setFetching(true);
        }).catch(e=>{
            console.log(e);
        })
    },[username]);

    useEffect(()=>{
        if(fetching){
            MediaService('user_media',page,username).then(resp=>{
                const buf = resp.data.images;
                buf.sort((a,b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime());
                buf.map(element => 
                    {element.date = element.date.split('T')[0]} );
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
    },[fetching,username]);

    const scrollHandler=(e)=>{
        if(e.target.scrollHeight-(e.target.scrollTop+window.innerHeight)
            < 0.15*e.target.scrollHeight){
            setFetching(true);
        }   
    }

    return (
        <div className='my_videos_wrapper'>
            {userData.username?
            <div className='stats block'>
            <div className='user_info block'>
                <h1 className='content_creator'>{userData.username}</h1>
                <h3 className='subs'>Subscribers: {userData.subscribers}</h3>
                <h3 className='desc'>{userData.description}</h3>
                {username===cookie.data.username?
                    <img className='edit' onClick={()=>{setShowEditUser(true)}} src={require('../../img/edit.png')} alt="alt"/>
                    :null}
            </div>
            <div className='charts'>
                <div className='likes chart block'>
                    <ResponsiveContainer  width="100%" height="80%">
                        <LineChart data={userData.likes}>
                            <Tooltip labelFormatter={value => {return `${userData.likes[value].date}`;}}/>
                            <Line type="monotone" dataKey="likes" stroke="blue" />
                        </LineChart>
                    </ResponsiveContainer>
                    <h3>likes</h3>
                </div>
                <div className='comments chart block'>
                    <ResponsiveContainer  width="100%" height="80%">
                        <LineChart data={userData.views}>
                            <Tooltip labelFormatter={value => {return `${userData.views[value].date}`;}}/>
                            <Line type="monotone" dataKey="views" stroke="red" />
                        </LineChart>
                    </ResponsiveContainer>
                    <h3>views</h3>
                </div>
            </div>
        </div>
        :<Spinner/>}
            <div className='wrapper' id='my_videos'>
                {videos.length===0?
                    <Spinner/>:
                videos.map((video)=>{
                    if(video.type==='divider')
                        return <Divider data={video.date} key={video.date}/>
                    else
                        return <Video video={video} type='edit' key={video.index} extra={username}/>
                }  )}
            </div>
            {showEditUser?<EditUserPanel func={setShowEditUser}/>:null}
        </div>
    );
}

export default UserPanel;