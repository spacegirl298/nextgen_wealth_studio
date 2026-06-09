/**
 * TrackProgress.jsx
 * Progress summary bar for a strategy track.
 * Props: totalStages, completedStages, onCelebrate (optional callback)
 */
import styles from "../Tracks.module.css";

export default function TrackProgress({ totalStages, completedStages }) {
  const pct = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  return (
    <div className={styles.trackProgressWrap} role="region" aria-label="Track progress">
      <div className={styles.trackProgressHeader}>
        <span className={styles.trackProgressLabel}>Overall Progress</span>
        <span className={styles.trackProgressCount} aria-live="polite">
          {completedStages} / {totalStages} stages complete
        </span>
      </div>

      <div
        className={styles.trackProgressTrack}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% complete`}
      >
        <div
          className={styles.trackProgressFill}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className={styles.trackProgressPct}>{pct}%</div>

      {completedStages > 0 && completedStages === totalStages && (
        <div className={styles.trackCompleteMsg} role="status">
          🎉 Track complete — outstanding discipline.
        </div>
      )}
    </div>
  );
}