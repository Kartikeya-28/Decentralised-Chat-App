import React, { useEffect, useState } from 'react'
import RightComponent from './RightComponent';
import './RightPart.css'
import { ethers } from 'ethers';
const RightPart = ({person,friend,contract,currentAddress}) => {
    const [chats,setchats] = useState([]);

    useEffect(()=>{
      const uchats = async() => {
        const chats = await contract.getChats(ethers.getAddress(friend));
        setchats(chats);
      }

      const gchats = async() => {
        const chats = await contract.getGroupChat(ethers.getAddress(friend));
        setchats(chats);
      }

    if(friend != null){
      if(person === 'user') uchats();
      if(person === 'group') gchats();
    }
    },[friend,chats,setchats,contract,person])
    
    if(friend != null){
      return (
          <> 
            {chats.map((post)=>{
              if(ethers.getAddress(post.sender) === ethers.getAddress(currentAddress)) return <RightComponent person = {person} user = {"me"} message={post.message} sender = {post.sender} id = {post.id} contract = {contract} friend = {friend}/>
              else return <RightComponent person = {person} user = {"other"} message={post.message} sender = {post.sender} id = {post.id} contract = {contract} friend = {friend}/>
            })}
          </>
      )
    }

}

export default RightPart;