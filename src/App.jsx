import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import Login from "./Login";

function App() {
    return (
    <Router>
        <Routes>
            <Route exact path="/" element={<Login/>}/>
        </Routes>
    </Router>
    );
}

export default App;