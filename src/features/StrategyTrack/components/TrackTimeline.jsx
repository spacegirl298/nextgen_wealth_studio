
import styles from "../Tracks.module.css";

export default function TrackTimeline({ stages, statuses, activeIndex, onSelect }) {
  const handleSelect = (i) => {
    onSelect(i);
  };

  return (
    <div className={styles.timelineWrap} role="navigation" aria-label="Stage timeline">
      {stages.map((stage, i) => {
        const status = statuses[i];
        const isActive = i === activeIndex;

        return (
          <button
            key={stage.id}
            className={[
              styles.timelineDot,
              status === "done" ? styles.timelineDotDone : "",
              status === "active" ? styles.timelineDotActive : "",
              status === "locked" ? styles.timelineDotLocked : "",
              isActive ? styles.timelineDotSelected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => handleSelect(i)}
            onTouchEnd={() => handleSelect(i)}
            aria-label={`Stage ${i + 1}: ${stage.title}`}
            aria-current={isActive ? "step" : undefined}
          >
            <span className={styles.timelineDotIcon}>{stage.icon}</span>
            {i < stages.length - 1 && (
              <div
                className={[
                  styles.timelineConnector,
                  status === "done" ? styles.timelineConnectorDone : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}