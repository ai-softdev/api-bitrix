import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter.jsx";
import React from "react";
import AnimateBg from "./components/AnimateBg.jsx";

function App() {

  return (
      <div className={'relative overflow-hidden min-h-[100vh]'}>
          <BrowserRouter>
              <AnimateBg/>
              <AppRouter/>
          </BrowserRouter>
      </div>
  )
}

export default App
