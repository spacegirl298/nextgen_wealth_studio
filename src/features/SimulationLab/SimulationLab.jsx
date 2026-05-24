/*Simulation Lab overview/selection page.
–	Intro header explaining what the Simulation Lab is
–	Three studio cards: Property, Luxury, Local vs Offshore
–	Each card: title, description, what it helps you decide, 'Enter Studio' button
–	Cards read from FinancialContext to show a personalised teaser (e.g. 'Based on your income, you could afford a bond of R X')
–	Navigation to each studio route
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/SelectionLayout.module.css";
import OverviewCard from "../../components/UI/Card";
import PropImg from "../../assets/Simulation/PropImg.jpg";
import CarImg from "../../assets/Simulation/CarImg.jpg";
import LocalImg from "../../assets/Simulation/LocalImg.jpg";

export default function SimulationLab() {
  const navigate = useNavigate();

  const handlePropertyClick = () => {
    navigate("/simulation/property");
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.heroContent}>
          <h1>Simulation Lab</h1>
          <p className={styles.intro}>
            The Simulation Lab helps you test out your financial decisions
            before making them in real life. Adjust your information and
            instantly see how these choices could affect your finances.
          </p>
        </div>

        <div className={styles.grid}>
          <OverviewCard
            title="Property vs Renting in Joburg"
            description="This simulation lab allows you to explore and compare the financial outcomes of renting versus buying property in Johannesburg. By inputting personal financial details - such as income, savings, expenses, and expected property costs - you can generate tailored projections that illustrate the long-term impact of each option.This simulation provides a clear, data-driven comparison, helping you understand factors like monthly affordability, interest rates, and overall investment value. "
            buttonText="Launch Simulation"
            status="ready"
            imageSrc={PropImg}
            onButtonClick={handlePropertyClick}
          />

          <OverviewCard
            title="Luxury Car vs Investing the Difference"
            description="This simulation lab helps you explore the trade-off between making status-driven purchases and prioritizing long-term wealth building. While buying a luxury car can offer immediate satisfaction and social appeal, it often comes with significant financial implications over time. By inputting your personal financial details, you can compare the short-term rewards against the long-term impact on savings, investments, and overall financial growth. This tool is designed to provide clear insight into whether such a purchase aligns with your financial goals."
            status="construction"
            imageSrc={CarImg}
          />

          <OverviewCard
            title="Local vs Offshore Investing"
            description="This simulation lab helps you navigate the decision of how to balance their investment portfolio between local and offshore opportunities. For young professionals, determining the right mix between familiar local markets and broader global exposure can often feel complex and uncertain. By exploring different allocation scenarios, you can better understand the potential risks, returns, and long-term implications of each approach. This experience is designed to simplify the decision-making process, making it more accessible, informative, and less intimidating"
            status="construction"
            imageSrc={LocalImg}
          />
        </div>
      </main>
    </div>
  );
}
