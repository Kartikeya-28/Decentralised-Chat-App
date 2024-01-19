import React, { useLayoutEffect } from 'react'
import abi from "../contracts/chatDapp.json";
import { useState,useEffect } from 'react';
import ChatApp from './chatApp';
import "./login.css"
const {ethers} = require("ethers");

const Login = () => {
    const [state,setState] = useState({
        provider : null,
        signer: null,
        contract : null
      })
      const [account,setAccount] = useState("None");
      const [x,setX] = useState("Connect Wallet");
      const [login,setLogin] = useState(false);
      const connectWallet = async()=>{
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contractAbi = abi.abi;
        console.log(x);
        try{
          if(window.ethereum != null && x === "Connect Wallet"){
            const account = await window.ethereum.request({method : 'eth_requestAccounts',});
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            console.log(signer);
            const contract = new ethers.Contract(contractAddress,contractAbi,signer);
            console.log(1008);
            window.ethereum.on("chainChanged", () =>{
              window.location.reload();
            })
    
            window.ethereum.on("accountsChanged", ()=>{
              window.location.reload();
            })
    
            setAccount(account[0]);
            setX("Disconnect");
            setState({provider,signer,contract});
            setLogin(true);

          }
          else if(x === "Disconnect"){
            window.location.reload();
            setX("Connect");
            setAccount("None");
          }
        }catch(error){
          console.log(error);
        }
      }
    if(login === false){
      console.log(login);
        return (
            <div className= "loginContainer">
                <div className='insideLogin'>
                  <p>Welcome to the Decentralised Chatting App</p>
                  <button className = "loginButton" onClick={async() =>connectWallet()}>{x}</button>
                </div>
            </div>
        )
    }
    else{
        console.log(login);
        return(
            <>
              <ChatApp state = {state} account = {account}/>
            </>
        )
    }
}

export default Login;