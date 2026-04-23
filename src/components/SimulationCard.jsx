import React from "react";
import styles from "../pages/SimulationLab/Simulation.module.css";

export default function SimulationCard({
  title,
  description,
  buttonText,
  status,
  imageSrc,
  onButtonClick,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <img src={imageSrc} alt={title} />
      </div>

      <div className={styles.cardContent}>
        <h2>{title}</h2>
        <p>{description}</p>

        {status === "ready" && (
          <button className={styles.button} onClick={onButtonClick}>
            {buttonText}
          </button>
        )}

        {status === "construction" && (
          <div className={styles.status}>🔒︎ Under Construction</div>
        )}
      </div>
    </div>
  );
}
