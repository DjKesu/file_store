import React from 'react';
import logo from './logo.svg';
import './App.css';
import { authorize, getIdentity} from "./keyConnect";

(global as any).WebSocket = require("isomorphic-ws");

function App() {
  
  return (
    <h1>Connecting and authenticating with buckets</h1>
  );
}

export default App;
