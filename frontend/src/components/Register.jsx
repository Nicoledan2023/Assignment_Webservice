import React from 'react';
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./register.css"

export default function Register({ setShowRegister }) {

  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      await axios.post("/users/register", newUser);
      setSuccess(true);
      setFailure(false);
    } catch (err) {
      setFailure(true);
      setSuccess(false);
    }
  };


    return (
      <div className="registerContainer">
        <div className="logo">
          <Room />
          DanDan
        </div>
        <form className="registerForm" onSubmit={ handleSubmit }>
       
          <input
            className="registerInput"
            type="text"
            placeholder="Enter your username..."
            ref={ nameRef }
          />
          <label>Email</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter your email..."
            ref={ emailRef }
          />
          <label>Password</label>
          <input
            className="registerInput"
            type="password"
            placeholder="Enter your password..."
            ref={ passwordRef }
          />
          <button className="registerBtn">Register</button>
          { success && (
            <span className="success">Successfull.You can login now!</span>
          ) }
          { failure && (
            <span className="failure">Something Wrong!</span>
          ) }
        </form>
        <button className="registerLoginButton">Login</button>
        <Cancel className="registerCancel" onClick={ () => setShowRegister(false)} />
      </div>
    );
  }

