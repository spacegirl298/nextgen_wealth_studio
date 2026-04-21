import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Track.module.css";
import SimulationCard from "../../components/TrackCard";
import BuildImg from "../../assets/Track/BuildImg.jpg";
import BalanceImg from "../../assets/Track/BalanceImg.jpg";
import GlobalImg from "../../assets/Track/GlobalImg.jpg";
import TrackCard from "../../components/TrackCard";

export default function SimulationLab() {
  const navigate = useNavigate();

  const handlePropertyClick = () => {
    navigate("/explainer");
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.heroContent}>
          <h1>Strategy Track</h1>
          <p className={styles.intro}>
            The Strategy Tracks are predefined financial journeys designed to
            help you make clearer long-term decisions. This dashboard presents a
            structured 5-year roadmaps that show where you’re heading
            financially, the milestones you can expect along the way, and the
            behavioural adjustments needed to stay on course.
          </p>
        </div>

        <div className={styles.grid}>
          <TrackCard
            title="First Property Builder"
            description="The First Property Builder track is designed for young professionals who are working toward the milestone of home ownership. It focuses on helping you build a solid financial foundation through disciplined saving for a deposit, maintaining a strong credit profile, and ensuring that your future home remains affordable in the long term. This track encourages stability and consistency, guiding you away from high-risk investments and frequent job changes, so you can confidently move toward owning your first property."
            buttonText="Launch Strategy Track"
            status="ready"
            imageSrc={BuildImg}
            onButtonClick={handlePropertyClick}
          />

          <TrackCard
            title="Balanced Lifestyle & Investing"
            description="The Balanced Lifestyle and Investing track is designed for professionals who want to enjoy their money now while still building long-term financial security. It helps you develop sustainable habits such as investing consistently, staying flexible with your finances, and intentionally budgeting for lifestyle experiences. This track encourages a healthy balance, guiding you away from financial burnout and helping you avoid making decisions driven purely by fear, so you can build wealth while still enjoying the present."
            status="construction"
            imageSrc={BalanceImg}
          />

          <TrackCard
            title="Aggressive Global Investor"
            description="The Aggressive Global Investor track is designed for ambitious high earners who are comfortable taking on higher levels of risk in pursuit of faster wealth growth. It focuses on helping you maintain a high savings and investment rate, expand your exposure to global markets, and actively engage with emerging financial opportunities. This track encourages a proactive and growth-driven mindset, guiding you toward building significant wealth through strategic, globally diversified investing."
            status="construction"
            imageSrc={GlobalImg}
          />
        </div>
      </main>
    </div>
  );
}
