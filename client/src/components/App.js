import '../css/App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import MenuPage from "./Pages/MenuPage";
import SignUpPage from "./Pages/SignUpPage";
import ForgotPage from "./Pages/ForgotPage";
import RecoverPage from "./Pages/RecoverPage";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignUpPage/>}/>
          <Route path='/forgot' element={<ForgotPage/>}/>
          <Route path='/menu/*' element={<MenuPage/>}/>
          <Route path='/recover' element={<RecoverPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
