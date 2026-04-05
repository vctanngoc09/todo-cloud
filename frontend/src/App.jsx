import { useState } from "react";

import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import { Login, Register } from "./pages/Auth";

function App() {
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
