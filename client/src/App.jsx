import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ModeTogle from './components/Mycomponets/ModeTogle'
import Login from './components/Mycomponets/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
     <ModeTogle />
      <Login/>
    </>
  )
}

export default App
