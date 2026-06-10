//Wraps everything in the context providers
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { UserProvider } from './context/UserContext'
import { FinancialProvider } from './context/FinancialContext'
//import { NudgeProvider } from './context/NudgeContext'

import './index.css'

import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <FinancialProvider>
         {/* <NudgeProvider>*/}
            <App />
         {/* </NudgeProvider>*/}
        </FinancialProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)