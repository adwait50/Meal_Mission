<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
=======
import React from "react";
import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import DonorRegister from "../pages/DonorRegister";
import DonorLogin from "../pages/DonorLogin";
import DonorHome from "../pages/DonorHome";
import DonorLogout from "../pages/DonorLogout";
import DonorProtectedWrapper from "../pages/DonorProtectedWrapper";
import NgoRegister from "../pages/NgoRegister";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donor-register" element={<DonorRegister />} />
        <Route path="/donor-login" element={<DonorLogin />} />
        <Route
          path="/donor-home"
          element={
            <DonorProtectedWrapper>
              <DonorHome />{" "}
            </DonorProtectedWrapper>
          }
        />
        <Route path="/donor-logout" element={<DonorLogout />} />

        <Route path="ngo-register" element={<NgoRegister />} />
      </Routes>
    </div>
  );
}

export default App;
>>>>>>> 57dd0599a151e5ed947fe39c4096cd8882502e3e
