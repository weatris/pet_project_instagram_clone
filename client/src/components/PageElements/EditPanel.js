import React, {useEffect, useState} from 'react';
import '../../css/MenuPage.css';
import { useParams } from "react-router-dom";
import {GetMediaData} from '../../services/services';
import {GetMediaImage} from '../../services/services';
import {UpdateMedia, DeleteMedia} from '../../services/services';
import {useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';
import {Spinner} from './CommonElements';

function EditPanel() {
    const {index} = useParams();
    const [cookie] = useCookies('data');
    const [imgSrc,setImgSrc] = useState('');
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const navigator = useNavigate();
    
    const getWatchData = async()=>{
        await GetMediaData(index)
        .then(resp=>{
            setImgSrc(resp.data.path||'');
            setName(resp.data.name||'');
            setDescription(resp.data.description||'')
        })
        .catch(err=>{
            console.log(err);
            navigator('/menu/my_panel');
        })
    }

    const handleError=(err)=>{
        console.log(err);
    }

    const handleSubmit= async(e)=>{
        e.preventDefault()

        await UpdateMedia(name,description,index)
            .then(resp=>{
                if(resp.data.message==='Success')
                    navigator(`/menu/user/${cookie.data.username}`);
            })
            .catch(err=>{
                handleError(err);
            })
    }

    const handleCancel=(e)=>{
        e.preventDefault()
        navigator(`/menu/user/${cookie.data.username}`);
    }

    const handleDelete= async(e)=>{
        e.preventDefault()
        await DeleteMedia(index)
            .then(resp=>{
                if(resp.data.message==='Success')
                    navigator(`/menu/user/${cookie.data.username}`);
            })
            .catch(err=>{
                handleError(err);
            })
    }

    useEffect(()=>{
        getWatchData();
    },[index])

    return (
        <form className="panel">
            <h1 id='message'>Edit image</h1>
            <div id='image'>
            {imgSrc?
                <img src={GetMediaImage(imgSrc)} alt='image_to_edit'/>
            :<Spinner/>}
            </div>
            <input id='edit_name' value={name} onChange={e=>{setName(e.target.value)}} type='text' placeholder='Enter name of your video'/>
                <textarea id='edit_description' value={description} onChange={(e)=>{setDescription(e.target.value)}} placeholder='Enter description of your video'/>
                <div className='panel_buttons'>
                    <button className='cancel' onClick={handleCancel}>Cancel</button>
                    <button className='delete' onClick={handleDelete}>Delete</button>
                    <button className='submit' onClick={handleSubmit}>Submit</button>
                </div>
        </form>
    );
}

export default EditPanel;