/**
 * TrackTimeline.jsx
 * Horizontal visual timeline showing all stages within a track.
 *
 * Props:
 *   stages        — array of stage objects from tracksData
 *   stageStatuses — array of "done" | "active" | "locked" matching stages[]
 *   onStageClick  — optional callback(stageId, index) — scrolls to that milestone
 */

import styles from "../Tracks.module.css";

export default function TrackTimeline({ stages = [], stageStatuses = [], onStageClick }) {
  return (
    <nav
      className={styles.timeline}
      aria-label="Track stages"
    >
      <ol className={styles.timelineList}>
        {stages.map((stage, i) => {
          const status = stageStatuses[i] ?? "locked";
          const isDone   = status === "done";
          const isActive = status === "active";

          return (
            <li
              key={stage.id}
              className={styles.timelineItem}
            >
              {/* Connector line before this node (skip for first) */}
              {i > 0 && (
                <div
                  className={`${styles.timelineConnector} ${
                    stageStatuses[i - 1] === "done"
                      ? styles.timelineConnectorDone
                      : styles.timelineConnectorPending
                  }`}
                  aria-hidden="true"
                />
              )}

              <button
                className={`${styles.timelineNode} ${
                  isDone
                    ? styles.timelineNodeDone
                    : isActive
                    ? styles.timelineNodeActive
                    : styles.timelineNodeLocked
                }`}
                onClick={() => onStageClick?.(stage.id, i)}
                aria-label={`Stage ${i + 1}: ${stage.title} — ${status}`}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M3 7.5l3 3 5-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span aria-hidden="true">{i + 1}</span>
                )}
              </button>

              <span
                className={`${styles.timelineLabel} ${
                  isDone
                    ? styles.timelineLabelDone
                    : isActive
                    ? styles.timelineLabelActive
                    : styles.timelineLabelLocked
                }`}
              >
                {stage.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}