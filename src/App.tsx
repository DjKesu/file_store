import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { authorize, getIdentity} from "./keyConnect";
import {AiOutlineCloudUpload} from 'react-icons/ai';

(global as any).WebSocket = require("isomorphic-ws");

function App() {
  const [file, setFile] = useState();
  const onChangeFile = (e:any) => {
    console.log(e.target.files);
    setFile(e.target.files);
    console.log(file);
  }
  const [authMessage, setAuthMessage] = useState("You're authorized");

  const keyCheck = async () => {
    const cached = localStorage.getItem("user-private-identity");
    if (cached === null) {
        setAuthMessage("Create new identity");
    }
    else {
      setAuthMessage(cached.toString());
    }
  }
  useEffect(() => {
    keyCheck();
  }, []);
  return (
    <div className='app'>
    <h1 className='app-header'>Welcome to your decentralized storage</h1>
    <h1>Connecting and authenticating with buckets</h1>
    <button>{authMessage}</button>
    <h2>Your threads</h2>
    <h3>Your buckets</h3>
    <h4>Upload a file. We encrypt and decentralize that data.</h4>
    <p>This way your data is <b>ONLY</b> yours.</p>
    <AiOutlineCloudUpload size={70}/>
    <br/>
    <input type="file" onChange={onChangeFile}/>
    </div>
  );
}

export default App;
