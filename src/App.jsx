import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinancialProvider } from "./components/FinancialContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home/Home";
import MoneySnapshot from "./pages/MoneySnapshot/MoneySnapshot";
import StrategyTrack from "./pages/StrategyTrack/StrategyTrack";
import FirstPropertyBuilder from "./pages/FirstProperty/FirstPropertyBuilder";
import SimulationLab from "./pages/SimulationLab/SimulationLab";
import PropertySimulation from "./pages/PropertySim/PropertySim";
import BankingDNA from "./pages/BankingDNA/BankingDNA";
import Profile from "./pages/Profile/Profile";

export default function App() {
  return (
    <FinancialProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/money" element={<MoneySnapshot />} />
          <Route path="/track" element={<StrategyTrack />} />
          <Route path="/builder" element={<FirstPropertyBuilder />} />
          <Route path="/simulation" element={<SimulationLab />} />
          <Route path="/propertySim" element={<PropertySimulation />} />
          <Route path="/DNA" element={<BankingDNA />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </FinancialProvider>
  );
}
