import '../../css/LoginPage.css';
import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import { LoginService } from '../../services/services';
import {useEffect, useState} from "react";
import { useCookies } from 'react-cookie';

function LoginPage() {
    const navigator = useNavigate();
    const [cookie] = useCookies('data');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('Login');
    useEffect(()=>{
        try{
            if(cookie.data.username)
                navigator("/menu"); 
        }
        catch {}     
    })
    function Login(event){
        event.preventDefault();
        let elem = document.getElementById('login');
        if(password===''||username===''){
            setMessage('Invalid data');
            elem.style.color = 'crimson';
            return;
        }

        LoginService(username,password)
        .then((resp)=>{
            if(resp.data.message==='Success'){
                navigator("/menu");
            }
            else{
                setMessage(resp.data.message);
                elem.style.color = 'crimson';
            }
        })
    }
    return (
        <div className="center">
                <h1 id="login">{message}</h1>
            <form className="main">
                <div className="data">
                    <input type="text" onChange={(e)=>{setUsername(e.target.value)}} placeholder=" " autoComplete="on"/>
                        <span/>
                        <label>UserName</label>
                </div>
                <div className="data">
                    <input type="password" onChange={(e)=>{setPassword(e.target.value)}} placeholder=" " autoComplete="on"/>
                        <span/>
                        <label>Password</label>
                </div>
                <div className="forgot">
                    <Link to='/forgot'>Forgot Password ?</Link>
                </div>
                <input type="submit" value="Login" onClick={Login}/>
                <div className="signup">
                    <h4>First time here {"=>"}  <Link to='/signup'>SignUp</Link></h4>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;