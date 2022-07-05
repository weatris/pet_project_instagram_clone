import '../../css/MenuPage.css';
import React from 'react';
import { Routes,Route } from "react-router-dom";
import VideosPanel from "../PageElements/VideosPanel";
import HelpBars from "../PageElements/HelpBars";
import UploadPanel from "../PageElements/UploadPanel";
import HistoryPanel from "../PageElements/HistoryPanel";
import WatchPanel from "../PageElements/WatchPanel";
import EditPanel from "../PageElements/EditPanel";
import SearchPanel from '../PageElements/SearchPanel';
import {useNavigate} from "react-router-dom";
import MyVideosPanel from '../PageElements/MyVideosPanel';
import { useCookies } from 'react-cookie';
import {useEffect} from "react";

function MenuPage() {
    const navigator = useNavigate();
    const [cookie] = useCookies('data');
    useEffect(()=>{
        try{
            if(!cookie.data.username)
                navigator("/"); 
        }
        catch {}     
    })
    return (
        <div className="Menu">
            <HelpBars/>
                <Routes>
                    <Route path='/' element={<VideosPanel/>}/>
                    <Route path='/search/:search_param' element={<SearchPanel/>}/>
                    <Route path='/upload' element={<UploadPanel/>}/>
                    <Route path='/history' element={<HistoryPanel/>}/>
                    <Route path='/watch/:index' element={<WatchPanel/>}/>
                    <Route path='/my_media' element={<MyVideosPanel/>}/>
                    <Route path='/my_media/:index' element={<EditPanel/>}/>
                </Routes>
        </div>
    );
}

export default MenuPage;