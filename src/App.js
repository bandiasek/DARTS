import React from 'react'
import DartBoard from './components/DartBoard';

import './styles/Reset.css'
import './styles/App.css'

const App = () => {
  // Function that handles click on dart board
  const handleClick = (e) => {
      console.log(e.target.getAttribute('data-name'));
      
  }

  return(
    <div className="app__container">
          <div className="app__dartBoard" onClick={ e => handleClick(e) } >
            <DartBoard />
          </div>

          <div className="app__controlBoard">

          </div>

        </div>
  )
}

export default App;
