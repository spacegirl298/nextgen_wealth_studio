import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"

import Home from "./pages/Home/Home";
import MoneySnapshot from "./pages/MoneySnapshot/MoneySnapshot";
import StrategyTrack from "./pages/StrategyTrack/StrategyTrack";
import FirstPropertyExplainer from "./pages/FirstProperty/FirstPropertyExplainer";
import FirstPropertyBuilder from "./pages/FirstProperty/FirstPropertyBuilder";
import SimulationLab from "./pages/SimulationLab/SimulationLab";
import PropertySimulation from "./pages/PropertySim/PropertySim";
import BankingDNA from "./pages/BankingDNA/BankingDNA";
import Profile from "./pages/Profile/Profile";

export default function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/money" element = {<MoneySnapshot/>}/>
        <Route path = "/track" element = {<StrategyTrack/>}/>
        <Route path = "/explainer" element = {<FirstPropertyExplainer/>}/>
        <Route path = "/builder" element = {<FirstPropertyBuilder/>}/>
        <Route path = "/simulation" element = {<SimulationLab/>}/>
        <Route path = "/propertySim" element = {<PropertySimulation/>}/>
        <Route path = "/DNA" element = {<BankingDNA/>}/>
        <Route path = "/profile" element = {<Profile/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
