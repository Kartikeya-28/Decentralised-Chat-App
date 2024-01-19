import React from 'react'
import { useState,useEffect } from 'react';
import "./chatApp.css"
import Leftcomponent from './Leftcomponent';
import RightPart from './RightPart';
import { wait } from '@testing-library/user-event/dist/utils';
const send = require("../send.png");
const addFriendIcon = require("../user.png");
const createGroup = require("../group.png");
const add = require("../add-icon.png")
const logout = require("../log-out.png");
const friendIcon = require("../friend.png");
const groupIcon = require('../groupIcon.png');
const {ethers} = require("ethers");

const ChatApp = ({state,account}) => {
    
    const contract = state.contract;
    const provider = state.provider;
    const currentAddress = account;
    const [onlyfriends,setonlyfriends] = useState([]);
    const [onlygroups,setonlygroups] = useState([]);
    const [friendAddress,setFriendAddress] = useState(null);
    const [newAddress,setNewAddress] = useState("");
    const [newMessage,setNewMessage] = useState("");
    const [addingMember,setAddingMember] = useState("");
    const [addfriendvisibility,setAddFriendVisibility] = useState("hidden");
    const [addGroup,setAddGroupVisibility] = useState("hidden");
    const [friend,setFriend] = useState('visible'); // friend means either two person chat or group chat
    const [admin,setAdmin] = useState("");

    useEffect(()=>{
        const leftPart_Friends = async() => {
        
            const onlyfriends = await contract.getFriends();
            setonlyfriends(onlyfriends);
            
        }

        const leftPart_Groups = async() => {
        
            const onlygroups = await contract.getGroups();
            setonlygroups(onlygroups);
            
        }

        const getGroup = async() => {

            if(friendAddress !== null && friend === 'hidden'){
                const admin = await contract.get(ethers.getAddress(friendAddress));
                setAdmin(admin._admin);
            }

        }

        leftPart_Friends();
        leftPart_Groups();
        getGroup();
    },[contract,onlyfriends,onlygroups,setAddFriendVisibility,friendAddress,friend,setAdmin]);

    const addFriend = async() => {
        await contract.addFriend(ethers.getAddress(newAddress));
        setNewAddress("");
        setAddFriendVisibility("hidden");
    }
    
    const addMemberinGroup = async() => {
        if(ethers.isAddress(addingMember) === false) {alert("Enter valid address");return}
        await contract.addUser(ethers.getAddress(friendAddress),ethers.getAddress(addingMember));
        setAddingMember("");
    }

    const sendMessage = async() => {
        if(friend === 'visible') await contract.sendPost(ethers.getAddress(friendAddress),newMessage);
        else await contract.sendGroupPost(ethers.getAddress(friendAddress),newMessage);
        setNewMessage("");
    }
    const visibleUpper = () => {
        if(friendAddress === null) return "hidden";
        return "visible";
    }
    return (
        <>
        <div className='linerighty' style={{visibility : visibleUpper()}}></div>
        {friendAddress !== null && friend === 'hidden' && admin != "" && ethers.getAddress(currentAddress) === ethers.getAddress(admin) ? <div className= 'adduserinGroup'>
            <div style = {{fontSize : '16px',color: '#173d66',fontWeight: '600',marginLeft : '4px'}}>Add user:</div>
            <div style={{display : "inline-flex"}}>
                <input className = 'addMember1' value = {addingMember} placeholder = 'Enter Address...' onChange={(e)=>{setAddingMember(e.target.value);}}></input>
                <button className='doneButton' onClick={async() => addMemberinGroup()}>Done</button>
            </div>
        </div>
        :null}
        <div className='linerighty bottomLine' style={{visibility : visibleUpper()}}></div>
        <div className='chats'>
            <div className='profile'>
                <img src = {friendIcon} className='leftAdd i4' onClick = {()=>{setFriend('visible');setAddFriendVisibility('hidden');setAddGroupVisibility('hidden');setFriendAddress(null);}}/>
                <img src = {groupIcon} className='leftAdd i5' onClick = {()=>{setFriend('hidden');setAddFriendVisibility('hidden');setAddGroupVisibility('hidden');setFriendAddress(null);}}/>
                <img src = {addFriendIcon} className='leftAdd i1' id = 'leftyAdd' onClick={()=>{
                    if(addfriendvisibility === 'hidden'){
                        setAddFriendVisibility('visible');
                        setAddGroupVisibility('hidden');
                    }
                    else setAddFriendVisibility('hidden');
                    setFriend('visible');
                    setFriendAddress(null);
                }}/>
                
                <img src = {createGroup} className='leftAdd i2' onClick={()=>{
                    if(addGroup === 'hidden'){
                        setAddGroupVisibility('visible');
                        setAddFriendVisibility('hidden');
                        setFriend('hidden');
                    }
                    else{
                        setAddGroupVisibility('hidden');
                    }
                    setFriend('hidden');
                    setFriendAddress(null);
                }}/>
                <div><img src = {logout} className='leftAdd i3' onClick={async()=>{await wait(600);window.location.reload();}}/></div>
            </div>

            <div className='leftsideChat'>
                    {addGroup === 'visible' || addfriendvisibility === 'visible' ? 
                        (addfriendvisibility === 'visible'?
                            <div style={{visibility : addfriendvisibility}}>
                                <input type='text' placeholder= 'Address...' className='leftyInput' value = {newAddress} onChange={(e)=>{setNewAddress(e.target.value);}}/>
                                <div className='leftyIcon'><img src = {add}  className='friendaddy' onClick={addFriend}/></div>
                            </div> 
                            : <div className = "createGroup" onClick={async()=>{await contract.createGroup();}}>Create Group</div>
                        )
                    : null}
                    
                {friend === 'visible' ? onlyfriends.map((friends) => {
                    return(
                        <div className = "leftClicky" onClick={async() => {setFriendAddress(friends)}}>
                            <Leftcomponent friends = {friends} />
                            <div className='line'></div>
                        </div>
                    )
                })
                :null}
                {friend === 'hidden' ? onlygroups.map((friends) => {
                    return(
                        <div className = "leftClicky" onClick={async() => {setFriendAddress(friends)}}>
                            <Leftcomponent friends = {friends} />
                            <div className='line'></div>
                        </div>
                    )
                })
                : null}

            </div>
            <div className='rightyUpper'>
                <div className='rightUpper'>{friendAddress}</div>
            </div>
            <div className='rightsideChat'>{friend === 'hidden' ? <RightPart person = {"group"} friend = {friendAddress} contract={contract} currentAddress = {currentAddress}/> : <RightPart person = {"user"} friend = {friendAddress} contract={contract} currentAddress = {currentAddress}/>}</div>
        </div>
        <div className = 'right_input' style={{visibility : visibleUpper()}}>
            <input className = "right_input2" id = "message" value = {newMessage} type = "text" placeholder='Your message here...' onChange={(e)=>{setNewMessage(e.target.value);}}></input>
            <img src = {send} className='messageButton' onClick={sendMessage} alt=''/>
            </div>
        </>
    )
}

export default ChatApp