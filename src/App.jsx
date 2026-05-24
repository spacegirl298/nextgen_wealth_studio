import { Routes, Route } from "react-router-dom"
import { FinancialProvider } from "./context/FinancialContext"
import AuthGuard from "./features/Auth/components/AuthGuard"
import Navbar from "./components/Layout/Navbar"
import Footer from "./components/Layout/Footer"

// Auth
import Login from "./features/Auth/Login"
import Signup from "./features/Auth/Signup"
import ForgotPassword from "./features/Auth/ForgotPassword"
// Home
import Home from "./pages/Home/Home"
// Money Snapshot
import MoneySnapshot from "./features/MoneySnapshot/MoneySnapshot"
// Simulation Lab
import SimulationOverview from "./features/SimulationLab/SimulationLab"
import LocalStudio from "./features/SimulationLab/Studios/LocalStudio/LocalStudio"
import LuxuryStudio from "./features/SimulationLab/Studios/LuxuryStudio/LuxuryStudio"
import PropertyStudio from "./features/SimulationLab/Studios/PropertyStudio/PropertySim"
// Strategy Track
import StrategyOverview from "./features/StrategyTrack/StrategyTrack"
import AggressiveTrack from "./features/StrategyTrack/Tracks/AggressiveTrack/AggressiveTrack"
import LifestyleTrack from "./features/StrategyTrack/Tracks/LifestyleTrack/LifestyleTrack"
import PropertyTrack from "./features/StrategyTrack/Tracks/PropertyTrack/FirstPropertyBuilder"
// Profile & DNA
import Profile from "./pages/Profile/Profile"
import BankingDNA from "./features/BankingDNA/BankingDNA"

export default function App() {
  return (
    <FinancialProvider>
      <Navbar />
      <Routes>
        {/* Public routes*/}
        <Route path="/"               element={<Home />} />
        {/*Temporaray*/}
        <Route path="/money"          element={<MoneySnapshot />} />
        <Route path="/simulation"     element={<SimulationOverview />} />
        <Route path="/simulation/local"    element={<LocalStudio />} />
        <Route path="/simulation/luxury"   element={<LuxuryStudio />} />
        <Route path="/simulation/property" element={<PropertyStudio />} />
        <Route path="/track"          element={<StrategyOverview />} />
        <Route path="/track/property"    element={<PropertyTrack />} />
        <Route path="/track/lifestyle"   element={<LifestyleTrack />} />
        <Route path="/track/aggressive"  element={<AggressiveTrack />}/>
        <Route path="/profile"        element={<Profile />} />
        <Route path="/dna"            element={<BankingDNA />}/>

        {/*Real Route - just for testing purposes
        <Route path="/login"          element={<Login />} />
        <Route path="/signup"         element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />*/}

        {/* Protected routes*
        <Route path="/money"          element={<AuthGuard><MoneySnapshot /></AuthGuard>} />
        <Route path="/simulation"     element={<AuthGuard><SimulationOverview /></AuthGuard>} />
        <Route path="/simulation/local"    element={<AuthGuard><LocalStudio /></AuthGuard>} />
        <Route path="/simulation/luxury"   element={<AuthGuard><LuxuryStudio /></AuthGuard>} />
        <Route path="/simulation/property" element={<AuthGuard><PropertyStudio /></AuthGuard>} />
        <Route path="/track"          element={<AuthGuard><StrategyOverview /></AuthGuard>} />
        <Route path="/track/property"    element={<AuthGuard><PropertyTrack /></AuthGuard>} />
        <Route path="/track/lifestyle"   element={<AuthGuard><LifestyleTrack /></AuthGuard>} />
        <Route path="/track/aggressive"  element={<AuthGuard><AggressiveTrack /></AuthGuard>} />
        <Route path="/profile"        element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/dna"            element={<AuthGuard><BankingDNA /></AuthGuard>} />*/}
      </Routes>
      <Footer />
    </FinancialProvider>
  )
}