/**
 * TrackTimeline.jsx
 * Visual timeline of stages within any track.
 * Props:
 *   stages        — array of { id, title, icon, badge }
 *   statuses      — parallel array of "done" | "active" | "locked"
 *   activeIndex   — index of the currently expanded stage
 *   onSelect(i)   — called when a stage dot is clicked
 */
import styles from "../Tracks.module.css";

export default function TrackTimeline({ stages, statuses, activeIndex, onSelect }) {
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
            onClick={() => onSelect(i)}
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