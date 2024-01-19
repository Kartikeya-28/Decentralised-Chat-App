import React, { useEffect, useState,useLayoutEffect } from 'react';
import "./RightComponent.css";
import { ethers } from 'ethers';
import { wait } from '@testing-library/user-event/dist/utils';
const leftlogo =  require("../left-arrow.png");
const rightlogo = require("../right-arrow (1).png")
const heart = require("../heart.png");
const like = require("../like.png");
const editLogo = require("../edit.png");
const check = require("../check.png");

const RightComponent = ({person,user,message,sender,id,contract,friend}) => {
    const [visible,setVisible] = useState('hidden');
    const [likeColor,setLikeColor] = useState('white');
    const [heartColor,setHeartColor] = useState(null);
    const [messg,setMessg] = useState(null);
    const [edit,setEdit] = useState(false);
    const [widthChat,setWidthChat] = useState(null);
    const [reacted,setReacted] = useState([]);

    useEffect(()=>{
        const reactUsers = async()=>{
            const reacted = await contract.getReactedUsers(ethers.getAddress(friend),id);
            setReacted(reacted);
        }
        reactUsers();
    },[reacted,setReacted,friend,id]);

    const toggle = ()=>{
        if(visible === 'visible') setVisible('hidden');
        else setVisible('visible');
    }

    const setLike = async() =>{
        const likeView = await contract.getLike(ethers.getAddress(friend),id);
        if(likeView === false) setLikeColor('rgb(0 0 0 / 6%)');
        else setLikeColor('rgb(0 74 255 / 25%)');

    }

    const setLikeGroup = async() =>{
        const likeView = await contract.getLikeGroup(ethers.getAddress(friend),id);
        if(likeView === false) setLikeColor('rgb(0 0 0 / 6%)');
        else setLikeColor('rgb(0 74 255 / 25%)');

    }

    if(person === 'user') setLike();
    if(person === 'group') setLikeGroup();

    const setHeart  = async() =>{

        const heartView = await contract.getHeart(ethers.getAddress(friend),id);
        if(heartView === false) setHeartColor('rgb(0 0 0 / 6%)');
        else setHeartColor('#ff000044');

    }

    const setHeartGroup  = async() =>{

        const heartView = await contract.getHeartGroup(ethers.getAddress(friend),id);
        if(heartView === false) setHeartColor('rgb(0 0 0 / 6%)');
        else setHeartColor('#ff000044');

    }

    if(person === 'user') setHeart();
    if(person === 'group') setHeartGroup();

    const likeMessageToggle = async() => {
        await contract.likePostToggle(ethers.getAddress(friend),id);
    }

    const likeGroupMessageToggle = async() => {
        console.log(id);
        await contract.likeGroupPostToggle(ethers.getAddress(friend),id);
    }

    const heartMessageToggle = async() => {
        await contract.heartPostToggle(ethers.getAddress(friend),id);
    }

    const heartGroupMessageToggle = async() => {
        await contract.heartGroupPostToggle(ethers.getAddress(friend),id);
    }

    const editMessage = async() =>{
        await contract.editPost(ethers.getAddress(friend),ethers.getAddress(sender),id,messg);
        setVisible('hidden');
        setEdit(false);
    }

    const editGroupMessage = async() =>{
        await contract.editGroupPost(ethers.getAddress(friend),ethers.getAddress(sender),id,messg);
        setVisible('hidden');
        setEdit(false);
    }

    if(user === "me"){
        return (
            <>
            <div className='righty1'>
                <div className='moreOptions rightOptions' style = {{visibility : visible}}>
                    {reacted.length > 0 ? <div className='reacted'>   
                        {reacted.map((usersReacted)=>{
                            return(
                                <div className='reactuserObj'>
                                    {usersReacted.like === true ? 
                                        <img src={like} className='icon like userIcon' alt=''></img>
                                        : <img src={heart} className='icon heart' alt=''></img>
                                    }
                                    <div className='usersreacted'>{usersReacted._address}</div>
                                </div>
                            )
                        })}
                    </div>:null}
                    <img src={like} className='icon like' alt='' onClick={person === 'user' ? likeMessageToggle : likeGroupMessageToggle} style = {{backgroundColor : likeColor}}/>
                    <img src={heart} className='icon heart' alt='' onClick={person === 'user' ? heartMessageToggle : heartGroupMessageToggle} style={{backgroundColor : heartColor}}/>
                    {edit === false ? null : <img src={check} className='icon check' alt='' onClick={person === 'user' ? editMessage : editGroupMessage}/>}
                    <img src={editLogo} className='edit' alt='' onClick={async() => {setEdit(!edit);setMessg(message);setWidthChat(document.getElementsByClassName("rightychats user")[id].clientWidth)}}/>
                </div>
                <img  className = "logo rightyLogo" src = {leftlogo} onClick={toggle} alt=''/>
                {edit === false ? <div className='rightychats user'>{message}</div> : <input className='rightychats user editMessg' id = "editOption" type = "text" value = {messg} onChange={(e)=>{setMessg(e.target.value)}} style= {{width : widthChat}}/>}
            </div>
            </>
        )
    }
    else{
        return(
            <div className='righty2'>
                <div className='rightychats other'>{message}</div>
                <img  className = "logo leftyLogo" src = {rightlogo} onClick={toggle} alt=''/>
                <div className='moreOptions leftOptions' style={{visibility : visible}}>
                    <img src={heart} className='icon heart' alt='' onClick={person === 'user' ? heartMessageToggle : heartGroupMessageToggle} style = {{backgroundColor : heartColor}}/>
                    <img src={like} className='icon like' alt='' onClick={person === 'user' ? likeMessageToggle : likeGroupMessageToggle} style = {{backgroundColor : likeColor}}/>
                    {reacted.length > 0 ? <div className='reacted'>   
                        {reacted.map((usersReacted)=>{
                            return(
                                <div className='reactuserObj'>
                                    {usersReacted.like === true ? 
                                        <img src={like} className='icon like userIcon' alt=''></img>
                                        : <img src={heart} className='icon heart' alt=''></img>
                                    }
                                    <div className='usersreacted'>{usersReacted._address}</div>
                                </div>
                            )
                        })}
                    </div>:null}
                </div>
            </div>
        )
    }
}
export default RightComponent