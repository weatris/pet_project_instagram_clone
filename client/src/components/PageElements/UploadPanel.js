import '../../css/MenuPage.css';
import React from 'react';
import {useNavigate} from "react-router-dom";
import {UploadService} from '../../services/services';
import {useState} from 'react';
import {Spinner} from './CommonElements';

function UploadPanel() {
    const navigator = useNavigate();
    const [isReady,setIsReady] = useState(true);
    const [name,setName] = useState('name')
    const [description,setDescription] = useState('description')

    const AddFile = (event)=>{
        let preview = document.getElementById('preview');
        const file = event.target.files[0];
        preview.src = URL.createObjectURL(file);
        preview.onload = function() {
            URL.revokeObjectURL(preview.src);
        }
        document.getElementById('label').style.height = '25px'
        preview.style.maxHeight = '185px';
    }

    const Upload = async (e)=>{
        e.preventDefault();
        const formData = new FormData();
       
        formData.append('name',name);
        formData.append('description',description);
        formData.append('photo',document.getElementById("file_input").files[0]);
        setIsReady(false);
        await UploadService(formData)
            .then( resp =>{
                if(resp.data.message==='Success')
                    setIsReady(true);
            })
    }

    const Cancel = (e)=>{
        e.preventDefault();
        navigator("/menu");
    }
    return (
        <form className="panel">
            <h1 id='message'>Upload</h1>
            {isReady?
            <>
                <div className='file_input'>
                    <input type='file' id='file_input' name='image' accept="image/*" onChange={AddFile}/>
                    <label id='label' htmlFor='file_input'>Upload Image</label>
                    <img id='preview' alt='' src='#'/>
                </div>
                <input id='upload_name' type='text' placeholder='Enter name of your video' onChange={(e)=>setName(e.target.value)}/>
                <textarea id='upload_desc' placeholder='Enter description of your video' onChange={(e)=>setDescription(e.target.value)}/>
            </>
            :<Spinner/>}
            <div className='panel_buttons'>
                <button className='cancel' onClick={Cancel}>Cancel</button>
                <button className='submit' onClick={Upload}>Submit</button>
            </div>
        </form>
    );
}

export default UploadPanel;