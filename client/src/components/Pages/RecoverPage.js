import React from 'react';
import '../../css/LoginPage.css';
import { useNavigate } from "react-router-dom";
import { RecoverService } from '../../services/services';
import { useCookies } from 'react-cookie';

function RecoverPage(){
    
    const [ cookies ] = useCookies();
    const navigator = useNavigate();

    const ChangePassword = async (event)=>{
        event.preventDefault();
        let password = document.getElementById('password').value;
        let repeat_password = document.getElementById('repeat_password').value;
        let elem = document.getElementById('meta');

        if(password.length>12){
            elem.textContent = 'Password is too long';
            elem.style.color = 'crimson';
            return;
        }
        if(password.length<8){
            elem.textContent = 'Password is too short';
            elem.style.color = 'crimson';
            return;
        }
        if(password!==repeat_password){
            elem.textContent = 'Passwords should match';
            elem.style.color = 'crimson';
            return;
        }
        if(password.replace(/[a-z]/gi, '').length<2){
            elem.textContent = 'Password not safe enough';
            elem.style.color = 'crimson';
            return;
        }

        const { email, recoveryToken } = cookies.auth;
        await RecoverService(email,recoveryToken,password)
        .then(resp =>{
            console.log(resp.data)
            if (resp.data.message==='Success'){
                navigator('/', { replace: true });
            }
            else{
                elem.textContent = resp.data.message;
                elem.style.color = 'crimson';
            }
            });
    }

    function Cancel(event){
        event.preventDefault();
        navigator('/');
    }

    return (
        <div className="center">
            <div id="recover">
                <h1 id="meta">Recovering</h1>
            </div>
            <form className="main">
                <div className="data">
                    <input type="password" id="password" placeholder=" "/>
                    <span/>
                    <label>Password</label>
                </div>
                <div className="data">
                    <input type="password" id="repeat_password" placeholder=" "/>
                    <span/>
                    <label>Repeat Password</label>
                </div>
                <div className='container'>
                    <input type='submit' id='cancel' className="submit" value="Cancel" onClick={Cancel}/>
                    <input type='submit' className="submit" value="Submit" onClick={ChangePassword}/>
                </div>
            </form>
        </div>
    );
}

export default RecoverPage;