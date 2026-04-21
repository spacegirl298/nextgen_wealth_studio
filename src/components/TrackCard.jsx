import React from "react";
import styles from "../pages/StrategyTrack/Track.module.css";


export default function TrackCard({ title, description, buttonText, status, imageSrc }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <img src={imageSrc} alt={title} />
      </div>

      <div className={styles.cardContent}>
        <h2>{title}</h2>
        <p>{description}</p>

        {status === "ready" && (
          <button className={styles.button}>{buttonText}</button>
        )}

        {status === "construction" && (
          <div className={styles.status}>🔒︎ Under Construction</div>
        )}
      </div>
    </div>
  );
}
