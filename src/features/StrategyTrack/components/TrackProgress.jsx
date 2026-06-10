
import styles from "../Tracks.module.css";

export default function TrackProgress({ totalStages, completedStages }) {
  const pct = totalStages > 0 ? (completedStages / totalStages) * 100 : 0;

  return (
    <div className={styles.progressRow}>
      <div className={styles.progressLabels}>
        <span>Overall Progress</span>
        <span className={styles.progressGold}>
          {completedStages} / {totalStages} complete
        </span>
      </div>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}