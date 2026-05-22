//Defines all routes and applies AuthGuard where needed
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinancialProvider } from "./components/FinancialContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

//Authorisation
import Login from "./features/Auth/Login";
import Signup from "./features/Auth/Signup";
import ForgotPassword from "./features/Auth/ForgotPassword";
//Home
import Home from "./pages/Home/Home";
//Money Snapshot
import MoneySnapshot from "./features/MoneySnapshot/MoneySnapshot";
//Simulation Lab 
import SimulationOverview from "./features/SimulationLab/SimulationLab";
import LocalStudio from "./features/SimulationLab/Studios/LocalStudio/LocalStudio";
import LuxuryStudio from "./features/SimulationLab/Studios/LuxuryStudio/LuxuryStudio";
import PropertyStudio from "./features/SimulationLab/Studios/PropertyStudio/PropertySim";
//Strategy Track 
import StrategyOverview from "./features/StrategyTrack/StrategyTrack";
import AggressiveTrack from "./features/StrategyTrack/Tracks/AggressiveTrack/AggressiveTrack";
import LifestyleTrack from "./features/StrategyTrack/Tracks/LifestyleTrack/LifestyleTrack";
import PropertyTrack from "./features/StrategyTrack/Tracks/PropertyTrack/FirstPropertyBuilder";
//Profile
import Profile from "./pages/Profile/Profile";
//BankingDNA
import BankingDNA from "./features/BankingDNA/BankingDNA";


export default function App() {
  return (
    <FinancialProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/*Authorisation*/}
          <Route path = "/login" element = {<Login />}/>
          <Route path = "/signup" element = {<Signup/>}/>
          <Route path = "/forgotPassword" element = {<ForgotPassword/>}/>
          {/*Home*/}
          <Route path="/" element={<Home />} />
          {/*Money Snapshot*/}
          <Route path="/money" element={<MoneySnapshot />} />
          {/*Simulation Lab*/}
          <Route path = "/simulation" element = {<SimulationOverview/>}/>
          <Route path = "/local" element = {<LocalStudio/>}/>
          <Route path = "/luxury" element = {<LuxuryStudio/>}/>
          <Route path = "/propertyStudio" element = {<PropertyStudio/>}/>
          {/*Strategy Track*/}
          <Route path = "/track" element = {<StrategyOverview/>}/>
          <Route path = "/aggressive" element = {<AggressiveTrack/>}/>
          <Route path = "/lifestyle" element = {<LifestyleTrack/>}/>
          <Route path = "/propertyTrack" element = {<PropertyTrack/>}/>
          {/*Profile*/}
          <Route path = "/profile" element = {<Profile/>}/>
          {/*Banking DNA*/}
          <Route path = "/dna" element = {<BankingDNA/>}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </FinancialProvider>
  );
}
