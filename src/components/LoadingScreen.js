import React, { useState, useContext } from 'react'
import { FuncContext } from './Context'

import '../styles/Loading.css'

const LoadingScreen = () => {
      // Storing userData
      const [userData, setUserData] = useState({
            name: ''
      })

      // Parsing functions
      const { setPlayer } = useContext(FuncContext)

      // Handling change in input
	const onChangeHandler = (e) => {
		e.preventDefault()
		setUserData({
			...userData,
			[e.currentTarget.name]: e.currentTarget.value,
		})
	}

      return(
            <div className="loading__container">
                  <div className="loading__blur"></div>
                  <div className="loading__containerBox">
                        <h1>Ideš vyhrať ?</h1>
                        <form onSubmit={e => {
                              e.preventDefault()
                                    setPlayer(userData)
                              } }>
                              <input type="text" name="name" placeholder="Prezývka" required onChange={e => onChangeHandler(e)}/>
                              <button type="submit">Začni hru</button>
                        </form>
                  </div>
            </div>
      )
}

export default LoadingScreen