import React, { useState, useMemo, useEffect } from 'react'
import DartBoard from './components/OwnDartBoard'
import Cursor from './components/Cursor'

import LoadingScreen from './components/LoadingScreen'
import { FuncContext } from './components/Context'

import './styles/Reset.css'
import './styles/App.css'

const App = () => {
	// UKLADANIE PREMENNYCH DO HOOKU, useState je niečo ako ukladanie premennych ale je to dynamicke
	let focusingMode // premenná v ktorej beží proces zaostrenia kurzora
	const [loaded, setLoaded] = useState(false) // Premená aby sme overili ci je "prihlaseny"
	const [userData, setUserData] = useState({
		name: '',
		fatique: 30, // Únava, ktora je nastavená na najmensiu hodnotu"
	})
	const [gameData, setGameData] = useState({
		darts: [-1, -1, -1], // kazda sipka ma jednu polozku -1 je default, 0 je ak netrafi, inac body
		rounds: 1, // kolá
		points: 501, // body
		roundPoints: 0,  // body za kolo
		throws: 0, // hody
	})
	const [mouseMove, setMouseMove] = useState(false) // Táto premenná pozerá nato, že či sa myš hýbe

	// Obaľovač funkcii, tieto obalené funkcie cez ďalší hook posúvame všetkým childrenom
	const functions = useMemo(() => ({
		// Niečo na štyl prihlásenia
		setPlayer: (data) => {
			setUserData({
				...userData,
				...data,
			})
			setLoaded(true)
		},
	}))

	// Táto premenná sa volá vždy pri pohybe myšky
	const handleMove = (e) => {
		e.preventDefault() // zakážeme refresh stránky
		const cursor = document.querySelector('.cursor') // získame element kuurzora

		clearInterval(focusingMode) // vypneme zaostrovanie
		setMouseMove(true) // premena na pohyb mysi sa zmeni na true

		setTimeout(() => { // setTimeout sa spustí až po 100ms čo vytvorí simuláciu pohybu ruky
			setUserData({
				...userData,
				fatique: userData.fatique + 5 < 75 ? userData.fatique + 5 : 75, // ternary operator na simulovanie rozptilu pri pohybe
			})

			cursor.style.left = `${e.pageX}px`  // presun dynamického kurzoru na realnu poziíciu od ľava 
			cursor.style.top = `${e.pageY}px`  // presun dynamického kurzoru na pozicíu realného kurzoru od hora
		}, 100)

		let timeout  // tento timeout sleduje či sa kurzor nehýbe, je to nastavené na 3s
		;(() => {
			clearTimeout(timeout)  // tu sa to resetuje aby vždy počas pohybu to začalo odpočítavať znova
			timeout = setTimeout(() => setMouseMove(false), 3000)
		})()
	}

	// Táto funkcia sa spusti vždy pri kliku myši na boarde
	const handleClick = (e) => {
		if (gameData.darts.indexOf(-1)!== -1) { // pozrie sa či hráč má ešte šipky
			const cursor = document.querySelector('.cursor') // získame element nášho fake kurzoru
			const cross = document.createElement('div') // vytvoríme nový element
			cross.className = 'cross' // nazveme ho cross, teda krizik

			const left =
				cursor.style.left.match(/\d/g).join('').valueOf() -
				-getRandomInt(-userData.fatique + 3, userData.fatique - 3) // nastavíme skrze túto reťaz funkcii random pozíciu v kruhu rozptylu z lava
			const top =
				cursor.style.top.match(/\d/g).join('').valueOf() -
				-getRandomInt(-userData.fatique + 3, userData.fatique - 3) // toto iste ale zhora

			cross.style.left = `${left}px` // nastavíme tomu umiestnenie
			cross.style.top = `${top}px`

			throwHandle(document.elementFromPoint(left, top).getAttribute('name')) // zavoláme funckiu hodu, kde získame element, ktorý sa nachádza pod naším fake kurzorom

			document.querySelector('.app__container').appendChild(cross) // vytvorí to element ktorý sme si hore postupne definovali

			setUserData({
				...userData,
				fatique: 75, // nastavíme únavu na maximálnu hodnotu po hode
			}) 
		} else {
			alert('Nemáte ďalšie šipky, začnite ďalšie kolo')
		}
	}

	// Funkcia ktorá sa stara o hod, parameter berie body, ktoré získa vďaka tomu, že názvy divov sa zhodujú počtu bodov
	const throwHandle = (points) => {
		if(gameData.points !== 0) { // poistenie aby sa dačo nepopsulo
			const lastIndexDart = gameData.darts.indexOf(-1)
			var helpArray = gameData.darts
	
			helpArray[lastIndexDart] = points !== null ? points : 0 // vloží sa na posledné miesto voľnej šipky počet bodov
	
			setGameData({ // Nastavenie bodov na správnu hodnotu, tak isto iných premenych
				...gameData,
				darts: helpArray,
				points: gameData.points - points.valueOf() > -1
						? gameData.points - points.valueOf()
						: gameData.points,
				throws: gameData.throws + 1,
				roundPoints: gameData.roundPoints - - points.valueOf()
			})
		}

		if(gameData.points === 0) {
			alert('501 bodov ste nahádzali za ' + gameData.rounds + ' kôl, ' + gameData.throws + ' hodov... Ďakujeme vám, začnite ďalšiu hru tlačidlom reset')
		}
	}


	// Táto funkcia sa spustí keď chcete ísť do ďalšieho kola
	const nextRoundHandle = (e) => {
		e.preventDefault()

		if(gameData.darts.indexOf(-1)!== -1) {
			alert('Nevyčerpali ste všetky hody')
		} else {
			document.querySelectorAll('.cross').forEach((e) => e.remove()) // táto reťazová premenna vymaže všetky crossy, teda hody

			setTimeout(() => {
				setGameData({
					...gameData,
					rounds: gameData.rounds + 1,
					darts: [-1, -1, -1],
					roundPoints: 0
				})
			}, 500)	
		}
	}

	// Resetuje vám to hodnoty, takže začínate odznova
	const resetHandle = (e) => {
		e.preventDefault()
			document.querySelectorAll('.cross').forEach((e) => e.remove())

		setTimeout(() => {
			setGameData({
				darts: [-1, -1, -1],
				rounds: 1,
				points: 501,
				roundPoints: 0,
				throws: 0,
			})
		}, 500)	
	}

	// Random int
	const getRandomInt = (min, max) => {
		return Math.round(Math.random() * (max - min) + min)
	}

	// UseEffect je hook podobny ako, componentDidMount, teda spúšta sa keď sa aplikácia prvý raz načíta a beži prakticky pri každej zmene, napr pri pohybe myši
	useEffect(() => {
		const cursor = document.querySelector('.cursor')
		if (!mouseMove) { // overíme či sa myš hýbe, ak nie tak začneme zmenšovať rozptyl
			focusingMode = setInterval(() => { 
				setUserData({
					...userData,
					fatique: userData.fatique - 5 > 29 ? userData.fatique - 5 : 30,
				})
			}, 200)
		}

		if(cursor!== null ){ // editácia kurzora kde sa nastaví šírka a výška, teda roptyl na dvojnásobok, lebo je 75px do oboch stran
			cursor.style.width = `${userData.fatique * 2}px`
			cursor.style.height = `${userData.fatique * 2}px`
		}

		return () => { // upratanie hooku, aby sa neprelínali funkcie a necrashla apka 
			clearInterval(focusingMode)
		}
	})

	// Conditional rendering
	if (loaded) {
		return (
			<div className='app__container'>
				<Cursor className='.cursor' />
				<div className='app__dartBoardContainer'>
					<div
						className='dartBoardContainer__dartBoard'
						onMouseMoveCapture={(e) => handleMove(e)}
						onClick={(e) => handleClick(e)}
						onMouseEnter={(e) => {
							const cursor = document.querySelector('.cursor')
							cursor.style.display = 'block'
						}}
						onMouseLeave={(e) => {
							const cursor = document.querySelector('.cursor')
							cursor.style.display = 'none'
						}}
					>
						<DartBoard />
					</div>
					<div className='dartBoardContainer__darts'>
						{gameData.darts.map((dart) => {
							return <div >
								{dart !== -1 ? <h1>{dart}</h1> : ''}
							</div>
						})}
					</div>
				</div>

				<div className='app__controlBoard'>
					<h1>Hráč: {userData.name}</h1>

					<div className='controlBoard__score'>
						<h1>Body:</h1>
						<h1>{gameData.points}</h1>
					</div>

					<div className="controlBoard__data">
						<div className="controlBoardData__row">
							<h1>Kolo:</h1>
							<h1>{gameData.rounds}</h1>
						</div>
						<div className="controlBoardData__row">
							<h1>Body za kolo:</h1>
							<h1>{gameData.roundPoints}</h1>
						</div>
						<div className="controlBoardData__row">
							<h1>Počet hodov:</h1>
							<h1>{gameData.throws}</h1>
						</div>
					</div>
					
					<div className="controlBoard__buttons">
						<div className="controlBoardButtons__reset" onClick={e=>resetHandle(e)}>
							<h1>RESET</h1>
						</div>
						<div className="controlBoardButtons__round" onClick={e=>nextRoundHandle(e)}>
							<h1>Ďalšie<br />kolo</h1>
						</div>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<FuncContext.Provider value={functions}>
				<LoadingScreen />
			</FuncContext.Provider>
		)
	}
}

export default App
