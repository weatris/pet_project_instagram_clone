import '../../css/LoginPage.css';
import React from 'react';
import {useNavigate} from "react-router-dom";
import { CheckPassword, EditUser } from '../../services/services';
import {useState} from "react";
import { useCookies } from 'react-cookie';

function EditUserPanel({func}) {
    const navigator = useNavigate();
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [repeat_password, setRepeatPassword] = useState('');
    const [verified,setVerified] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('Editing');
    const [, , removeCookie] = useCookies('data');

    const handleCheckPassword = async (e)=>{
        e.preventDefault();
        await CheckPassword(checkPassword)
            .then(resp=>{
                if(resp.data.message==='Success'){
                    setVerified(true);
                    setDescription(resp.data.description);
                    setEmail(resp.data.email);
                    setUsername(resp.data.username);
                }    
                else
                    setMessage(resp.data.message);
            });
    }

    const Edit=async(e)=>{
        e.preventDefault();
        const elem = document.getElementById('message');

        function Warning(message){
            setMessage(message);
            elem.style.color = 'crimson';
        }
        switch(true){
            case username==='':
                Warning('Username cant be empty');
                return;
            case username.length<3:
                Warning('Username is too short');
                return;
            default:
                Warning('Smth went wrong!');
        }
        switch(true){
            case password==='':
                Warning('Password cant be empty');
                return;
            case password!==repeat_password:
                Warning('Passwords should match');
                return;
            case password.length<=8:
                Warning('Password is too short');
                return;
            case password.length>=12:
                Warning('Password is too long');
                return;
            case password.replace(/[a-z]/gi, '').length<2:
                Warning('Password not safe enough');
                return;
            default:
                Warning('Smth went wrong!');
    }
        switch(true){
            case repeat_password==='':
                Warning('Password cant be empty');
                return;
            case password!==repeat_password:
                Warning('Passwords should match');
                return;
            default:
                Warning('Smth went wrong!')
        }
        switch(true){
            case email==='':
                Warning('Email cant be empty');
                return;
            default:
                Warning('Smth went wrong!')
        }
        await EditUser(username, description, password||checkPassword, email)
        .then(resp=>{
            if(resp.data.message==='Success'){
                removeCookie('data',{path:'/'});
                navigator("/");
            }
        });
    }

    return (
        <div className='edit_user_panel'>
            
            <div className="center edit_panel" >
                    <h1 id='message'>{message}</h1>
                <form className="main">
                    {verified?<>
                        <div className="data">
                            <input value={username} onChange={(e) => { setUsername(e.target.value); } } type="text" placeholder=" " />
                            <span />
                            <label>UserName</label>
                        </div>
                        <div className="data">
                            <input value={email} onChange={(e) => { setEmail(e.target.value); } } type="text" placeholder=" " />
                            <span />
                            <label>Email</label>
                        </div>
                        <div className="data">
                            <input value={description} onChange={(e) => { setDescription(e.target.value); } } type="text" placeholder=" " />
                            <span />
                            <label>Description of your channel</label>
                        </div>
                    </>:null}
                    <div className="data">
                        <input type="password" onChange={(e)=>{verified?setPassword(e.target.value):setCheckPassword(e.target.value)}} placeholder=" " autoComplete="on"/>
                        <span/>
                        <label>Password</label>
                    </div>
                    {verified?
                        <div className="data">
                            <input type="password" onChange={(e)=>{verified?setRepeatPassword(e.target.value):setCheckPassword(e.target.value)}} placeholder=" " autoComplete="on"/>
                            <span/>
                            <label>Repeat Password</label>
                        </div>
                    :null}

                    <input type="submit" value="Submit" onClick={verified?Edit:handleCheckPassword}/>
                    <input type="submit" id="cancel" value="Cancel" onClick={()=>{func(false)}}></input>
                </form>
            
            </div>
            <div className='background'></div>
        </div>
    );
}

export default EditUserPanel;