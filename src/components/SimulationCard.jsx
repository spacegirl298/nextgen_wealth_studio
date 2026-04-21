// SimulationCard.jsx
import React from "react";
import styles from "../pages/Simulation.module.css";

export default function SimulationCard({ title, description, buttonText, status, imageSrc, imageEmoji }) {
  return (
    <div className={styles.card}>
      {/* Image section */}
      <div className={styles.cardImage}>
        {imageSrc ? (
          <img src={imageSrc} alt={title} />
        ) : (
          <div className={styles.imagePlaceholder}>
            {imageEmoji || "🏠"}
          </div>
        )}
      </div>
      
      {/* Content section */}
      <div className={styles.cardContent}>
        <h2>{title}</h2>
        <p>{description}</p>

        {status === "ready" && (
          <button className={styles.button}>{buttonText}</button>
        )}

        {status === "construction" && (
          <div className={styles.status}>Under Construction</div>
        )}
      </div>
    </div>
  );
}