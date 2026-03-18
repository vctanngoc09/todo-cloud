import { useState } from "react";

import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import { Login, Register } from "./pages/Auth";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
