import './App.css';
import abi from "./contracts/chatDapp.json";
import { useEffect,useState } from 'react';
import Login from './components/login';
const {ethers} = require("ethers");

function App() {
  return (
   <>
      <Login />
   </>
  );
}

export default App;
