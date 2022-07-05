import '../../css/LoginPage.css';
import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import { SignUpService } from '../../services/services';
import {useState} from "react";

function SignUpPage() {
    const navigator = useNavigate();
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [repeat_password, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('Registration');

   

    function SignUp(event){
        event.preventDefault();
        const elem = document.getElementById('register');

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

        SignUpService(username, firstname, lastname, password, email)
            .then((resp)=>{
                console.log(resp.data)
                if(resp.data.message==='Success'){
                    navigator("/");
                }
                else{
                    setMessage(resp.data.message);
                    elem.style.color = 'crimson';
                }
            })
    }

    return (
        <div className="center">
                    <h1 id="register">{message}</h1>
                <form className="main">
                    <div className="data">
                        <input type="text" onChange={(e)=>{setUsername(e.target.value)}} placeholder=" " autoComplete="on"/>
                        <span/>
                        <label>UserName</label>
                    </div>
                    <div className="data">
                        <input type="text" onChange={(e)=>{setFirstname(e.target.value)}} placeholder=" " autoComplete="on"/>
                        <span/>
                        <label>FirstName (optional)</label>
                    </div>
                    <div className="data">
                        <input type="text" onChange={(e)=>{setLastname(e.target.value)}} placeholder=" " autoComplete="on"/>
                        <span/>
                        <label>LastName (optional)</label>
                    </div>
                    <div className="data">
                        <input type="text" onChange={(e)=>{setEmail(e.target.value)}} placeholder=" " autoComplete="on"/>
                        <span/>
                        <label>Email</label>
                    </div>
                    <div className="data">
                        <input type="password" onChange={(e)=>{setPassword(e.target.value)}} placeholder=" " autoComplete="on"/>
                        <span/>
                        <label>Password</label>
                    </div>
                    <div className="data">
                        <input type="password" onChange={(e)=>{setRepeatPassword(e.target.value)}} placeholder=" " autoComplete="on"/>
                        <span/>
                        <label>Repeat Password</label>
                    </div>

                    <input type="submit" value="Submit" onClick={SignUp}/>
                    <div className="signup">
                        <h4>Already have an account {"=>"}  <Link to='/'>Log in</Link></h4>
                    </div>
                </form>
            </div>
    );
}

export default SignUpPage;