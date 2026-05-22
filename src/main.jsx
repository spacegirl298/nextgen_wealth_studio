//Wraps the entire app in all context providers
//Wraps UserContext, Financial Context, NudgeCOntext Providers
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/globals.css'
import './styles/variables.css'




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
      <App />
   
  </React.StrictMode>
)
