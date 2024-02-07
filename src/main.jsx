import React, {createContext} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ganttStore from "./store/ganttStore.js";

export const Context =createContext(null)

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
      <Context.Provider value={{
          ganttStore: new ganttStore()
      }}>
          <App />
      </Context.Provider>
  </>,
)
