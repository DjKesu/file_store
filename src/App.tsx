import React, {ChangeEvent, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { authorize, getIdentity, sign} from "./keyConnect";
import {AiOutlineCloudUpload} from 'react-icons/ai';
import Dropzone from 'react-dropzone';

(global as any).WebSocket = require("isomorphic-ws");

function App() {
  const [file, setFile] = useState<File>();
  const handleUpload = async(droppedFile:File) => {
    setFile(droppedFile);
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

  function getFileSize(){
    if (file === undefined) {
      return "";
    }
    return ((file?.size)/1000).toString() + " KB";
  }

  async function signwithKey(): Promise<void> {
    const id = await getIdentity();
    const signature = await sign(id);
    console.log(signature);
  }

  useEffect(() => {
    keyCheck();
  }, []);
  return (
    <div className='app'>
    <h1 className='app-header'>Welcome to your decentralized storage</h1>
    <h1>Connecting and authenticating with buckets</h1>
    <button onClick={()=> getIdentity()}>{authMessage}</button>
    <h2>Your threads</h2>
    <h3>Your buckets</h3>
    <h4>Upload a file. We encrypt and decentralize that data.</h4>
    <p>This way your data is <b>ONLY</b> yours.</p>
    <br/>
    <Dropzone onDrop={acceptedFiles => handleUpload(acceptedFiles[0])}>
      {({getRootProps, getInputProps}) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drop a File
              <br/><AiOutlineCloudUpload size={70}/>
            </p>
          </div>
        </section>
      )}
    </Dropzone>
    <p>{file?.name}</p>
    <p>File Size: {getFileSize()}</p>
    <button onClick={signwithKey}>Sign</button>
    <div>
      <h3>Upload file to your bucket</h3>
    </div>
    </div>
  );
}

export default App;
