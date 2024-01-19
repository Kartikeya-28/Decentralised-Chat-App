import React from 'react'
import { useState,useEffect } from 'react'
import "./left.css";
const {ethers} = require("ethers");

const Leftcomponent = ({friends}) => {
  return (
    <div className='left1'>   
        <div className='left2 left21'>{friends}</div>
        {/* <div className='left2 left22'>Kartikeya</div> */}
    </div>
  )
}

export default Leftcomponent