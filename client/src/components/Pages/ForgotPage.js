import React from 'react';
import '../../css/LoginPage.css';
import {useNavigate} from "react-router-dom";
import {ForgotService} from '../../services/services';

function ForgotPage() {
    const navigator = useNavigate();

    async function Recover(event){
        event.preventDefault();
        let email = document.getElementById('email').value;
        let elem = document.getElementById('meta');
        if (!email){
            elem.textContent = 'Invalid data';
            elem.style.color = 'crimson';
        }
        else{
            await ForgotService(email).then((resp) =>{
                elem.textContent = 'Check your email';

                setTimeout(function () {
                    navigator('/');
                }, 1000);
                });
        }
    }

    function Cancel(event){
        event.preventDefault();
        navigator('/');
    }

    return (
        <div className="center">
            <div id="forgot">
                <h1 id="meta">Recovering</h1>
            </div>
            <form className="main">
                <div className="data">
                    <input type="text" id="email" placeholder=" " autoComplete="on"/>
                    <span/>
                    <label>Email</label>
                </div>
                <div className='container'>
                    <input type='submit' className="submit" value="Submit" onClick={Recover}/>
                    <input type='submit' id='cancel' className="submit" value="Cancel" onClick={Cancel}/>
                </div>
            </form>
        </div>
    );
}

export default ForgotPage;