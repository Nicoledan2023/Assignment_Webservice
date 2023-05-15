import React from 'react';
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./Login.css"

export default function Login({ setShowLogin, myStorage ,setCurrentUser}) {
  
  const [failure, setFailure] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
      };
      
     
    try {
        const res = await axios.post("/users/login", user);
      
        myStorage.setItem('user', res.data.username);
        setCurrentUser(res.data.username);
        setShowLogin(false);
        
     setShowLogin(false);
    } catch (err) {
      setFailure(true);
    }

  };


    return (
      <div className="loginContainer">
        <div className="logo">
          <Room />
          Login
        </div>
        <form className="registerForm" onSubmit={handleSubmit}>
       <label>User Name</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter your username..."
            ref={nameRef}
          />
          <label>Password</label>
          <input
            className="registerInput"
            type="password"
            placeholder="Enter your password..."
            ref={passwordRef}
          />
        
         <button className="loginBtn" type='submit'>Login</button>
          { failure && (
            <span className="failure">Something Wrong!</span>
                ) }
            
        </form>
       
        <Cancel className="loginCancel" onClick={ () => setShowLogin(false)} />
      </div>
    );
}
  

