/**
 * MilestoneStep.jsx
 * Individual milestone/stage detail card — generic, used by all tracks.
 *
 * Props:
 *   stage        — { id, icon, title, desc, badge, actions[], tradeoffs[], warnings[], glossary[], example }
 *   status       — "done" | "active" | "locked"
 *   isExpanded   — bool
 *   onToggle     — () => void
 *   onComplete   — () => void  (called when "Mark as Complete" is clicked)
 *   completedAt  — ISO date string | null  (from localStorage)
 */
import { useState } from "react";
import styles from "../Tracks.module.css";

function GlossaryTerm({ term, def }) {
  const [open, setOpen] = useState(false);

  return (
    <span className={styles.glossaryTerm}>
      <button
        className={styles.glossaryBtn}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {term}
      </button>
      {open && (
        <span className={styles.glossaryPop}>
          <span className={styles.glossaryPopTitle}>{term}</span>
          <span className={styles.glossaryPopBody}>{def}</span>
        </span>
      )}
    </span>
  );
}

export default function MilestoneStep({
  stage,
  status,
  isExpanded,
  onToggle,
  onComplete,
  completedAt,
  stageNumber,
}) {
  const isLocked = status === "locked";
  const isDone = status === "done";

  const statusLabel = isDone ? "✓ Completed" : status === "active" ? "▶ In Progress" : "Locked";
  const statusClass = isDone
    ? `${styles.msStatus} ${styles.msStatusDone}`
    : status === "active"
    ? `${styles.msStatus} ${styles.msStatusActive}`
    : `${styles.msStatus} ${styles.msStatusLocked}`;

  const badgeClass = isDone
    ? `${styles.msBadge} ${styles.msBadgeDone}`
    : status === "active"
    ? `${styles.msBadge} ${styles.msBadgeActive}`
    : `${styles.msBadge} ${styles.msBadgeLocked}`;

  const iconClass = isDone
    ? `${styles.msIcon} ${styles.msIconDone}`
    : status === "active"
    ? `${styles.msIcon} ${styles.msIconActive}`
    : `${styles.msIcon} ${styles.msIconLocked}`;

  return (
    <div
      className={[
        styles.milestoneCard,
        isDone ? styles.milestoneCardDone : "",
        status === "active" ? styles.milestoneCardActive : "",
        isLocked ? styles.milestoneCardLocked : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Summary row — always visible, clickable to expand */}
      <button
        className={styles.milestoneCardHeader}
        onClick={isLocked ? undefined : onToggle}
        disabled={isLocked}
        aria-expanded={isExpanded}
        aria-controls={`stage-detail-${stage.id}`}
      >
        <div className={iconClass}>{stage.icon}</div>

        <div className={styles.milestoneCardMeta}>
          <div className={statusClass}>{statusLabel}</div>
          <div className={styles.msTitle}>{stage.title}</div>
          <div className={styles.msDesc}>{stage.desc}</div>
          {completedAt && (
            <div className={styles.completedDate}>
              Completed {new Date(completedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          )}
        </div>

        <div className={styles.milestoneCardRight}>
          <span className={badgeClass}>{stage.badge}</span>
          {!isLocked && (
            <svg
              className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 5l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {isExpanded && !isLocked && (
        <div
          id={`stage-detail-${stage.id}`}
          className={styles.milestoneCardBody}
        >
          {/* Actions */}
          <div className={styles.milestoneSection}>
            <div className={styles.milestoneSectionTitle}>Action Items</div>
            <ul className={styles.actionsList}>
              {stage.actions.map((a, i) => (
                <li key={i} className={styles.actionItem}>
                  <div className={styles.actionDot} />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tradeoffs */}
          {stage.tradeoffs && stage.tradeoffs.length > 0 && (
            <div className={styles.milestoneSection}>
              <div className={styles.milestoneSectionTitle}>Trade-Offs to Know</div>
              <div className={styles.tradeoffGrid}>
                {stage.tradeoffs.map((t, i) => (
                  <div key={i} className={styles.tradeoffPair}>
                    <div className={styles.tradeoffPro}>
                      <span className={styles.tradeoffIcon}>↑</span> {t.pro}
                    </div>
                    <div className={styles.tradeoffCon}>
                      <span className={styles.tradeoffIcon}>↓</span> {t.con}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {stage.warnings && stage.warnings.length > 0 && (
            <div className={styles.milestoneSection}>
              {stage.warnings.map((w, i) => (
                <div key={i} className={`${styles.alert} ${styles.alertWarn}`}>
                  <span className={styles.alertIcon}>⚠</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Glossary */}
          {stage.glossary && stage.glossary.length > 0 && (
            <div className={styles.milestoneSection}>
              <div className={styles.milestoneSectionTitle}>Key Terms</div>
              <div className={styles.glossaryRow}>
                {stage.glossary.map((g) => (
                  <GlossaryTerm key={g.term} term={g.term} def={g.def} />
                ))}
              </div>
            </div>
          )}

          {/* Example */}
          {stage.example && (
            <div className={styles.milestoneSection}>
              <div className={styles.milestoneSectionTitle}>Real Example</div>
              <div className={styles.exampleBox}>{stage.example}</div>
            </div>
          )}

          {/* Complete button */}
          {!isDone && (
            <div className={styles.milestoneCompleteWrap}>
              <button className={styles.completeBtn} onClick={onComplete}>
                Mark Stage as Complete
              </button>
            </div>
          )}

          {isDone && (
            <div className={styles.milestoneCompleteWrap}>
              <div className={`${styles.alert} ${styles.alertGood}`} style={{ justifyContent: "center" }}>
                <span className={styles.alertIcon}>✓</span>
                <span>Stage complete — well done. Move to the next stage when you're ready.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}