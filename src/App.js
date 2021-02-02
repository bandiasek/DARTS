import React, { useState } from 'react'
import DartBoard from './components/DartBoard';
import Cursor from './components/Cursor';

import './styles/Reset.css'
import './styles/App.css'

const App = () => {
  // Function that handles click on dart board
  const handleClick = (e) => {
      console.log(e.target.getAttribute('data-name'));
      
  }

  return(
    <div className="app__container"
      onMouseMove={ e => {
        const cursor = document.querySelector('.cursor')
        cursor.style.left = `${e.pageX}px`
        cursor.style.top = `${e.pageY}px`          
      } }
    >
      {/*Custom CURSOR*/}
      <Cursor className='.cursor' />

          <div className="app__dartBoard" onClick={ e => handleClick(e) } >
            <DartBoard />
          </div>

          <div className="app__controlBoard">

          </div>

        </div>
  )
}

export default App;
