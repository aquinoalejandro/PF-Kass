import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Kass from './components/Kass'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Hey!</h1>
        <p>My name is Gonzalo Alejandro Aquino, I'm a Fullstack Developer from Argentina.</p>
        <Kass />

      </div>
    </>
  )
}

export default App
