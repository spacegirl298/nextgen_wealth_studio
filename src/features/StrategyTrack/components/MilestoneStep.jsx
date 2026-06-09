/**
 * MilestoneStep.jsx
 * Individual stage detail card within a strategy track.
 *
 * Props:
 *   stage        — object from tracksData stages[]
 *   stageNumber  — 1-based index
 *   status       — "done" | "active" | "locked"
 *   onComplete   — callback(stageId) — marks stage complete in localStorage
 *   onUncomplete — callback(stageId) — unmarks stage
 */

import { useState } from "react";
import styles from "../Tracks.module.css";

const GlossaryTerm = ({ term, definition }) => {
  const [open, setOpen] = useState(false);

  return (
    <span className={styles.glossaryWrap}>
      <button
        className={styles.glossaryTrigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Define: ${term}`}
      >
        {term}
        <svg
          className={styles.glossaryIcon}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="6" cy="6" r="5" stroke="var(--clr-gold)" strokeWidth="1" />
          <text
            x="6"
            y="6"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7"
            fill="var(--clr-gold)"
          >
            ?
          </text>
        </svg>
      </button>
      {open && (
        <span className={styles.glossaryPopover} role="tooltip">
          <span className={styles.glossaryPopoverTerm}>{term}</span>
          <span className={styles.glossaryPopoverDef}>{definition}</span>
          <button
            className={styles.glossaryClose}
            onClick={() => setOpen(false)}
            aria-label="Close definition"
          >
            ×
          </button>
        </span>
      )}
    </span>
  );
};

export default function MilestoneStep({
  stage,
  stageNumber,
  status,
  onComplete,
  onUncomplete,
}) {
  const [eduOpen, setEduOpen] = useState(false);

  const isDone   = status === "done";
  const isActive = status === "active";
  const isLocked = status === "locked";

  return (
    <div
      className={`${styles.milestoneCard} ${
        isDone
          ? styles.milestoneCardDone
          : isActive
          ? styles.milestoneCardActive
          : styles.milestoneCardLocked
      }`}
      aria-disabled={isLocked}
    >
      {/* Header */}
      <div className={styles.milestoneCardHeader}>
        <div className={styles.milestoneStageNum}>
          {isDone ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="8" fill="var(--clr-gold)" />
              <path
                d="M5.5 9.5l2.5 2.5 4.5-4.5"
                stroke="#0a0a0a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span>{stageNumber}</span>
          )}
        </div>

        <div className={styles.milestoneCardMeta}>
          <div
            className={`${styles.milestoneStatus} ${
              isDone
                ? styles.milestoneStatusDone
                : isActive
                ? styles.milestoneStatusActive
                : styles.milestoneStatusLocked
            }`}
          >
            {isDone ? "Completed" : isActive ? "In Progress" : "Locked"}
          </div>
          <h3 className={styles.milestoneCardTitle}>{stage.title}</h3>
          <p className={styles.milestoneCardDesc}>{stage.description}</p>
        </div>
      </div>

      {/* Locked state — minimal content */}
      {isLocked && (
        <div className={styles.milestoneLockNotice}>
          Complete the previous stage to unlock this one.
        </div>
      )}

      {/* Active or Done — full content */}
      {!isLocked && (
        <>
          {/* Action items */}
          {stage.actionItems?.length > 0 && (
            <div className={styles.milestoneSection}>
              <div className={styles.milestoneSectionLabel}>Action Items</div>
              <ul className={styles.milestoneActionList}>
                {stage.actionItems.map((item, i) => (
                  <li key={i} className={styles.milestoneActionItem}>
                    <span className={styles.milestoneActionDot} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Trade-offs */}
          {stage.tradeoffs?.length > 0 && (
            <div className={styles.milestoneSection}>
              <div className={styles.milestoneSectionLabel}>Trade-offs to Consider</div>
              <div className={styles.tradeoffGrid}>
                {stage.tradeoffs.map((t, i) => (
                  <div key={i} className={styles.tradeoffRow}>
                    <div className={styles.tradeoffPro}>
                      <span className={styles.tradeoffProIcon} aria-hidden="true">↑</span>
                      <span>{t.pro}</span>
                    </div>
                    <div className={styles.tradeoffCon}>
                      <span className={styles.tradeoffConIcon} aria-hidden="true">↓</span>
                      <span>{t.con}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {stage.warnings?.length > 0 && (
            <div className={styles.milestoneSection}>
              {stage.warnings.map((w, i) => (
                <div key={i} className={styles.milestoneWarning} role="alert">
                  <span className={styles.milestoneWarningIcon} aria-hidden="true">⚠</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Educational content — collapsible */}
          {stage.educationalContent && (
            <div className={styles.milestoneSection}>
              <button
                className={styles.eduToggle}
                onClick={() => setEduOpen((v) => !v)}
                aria-expanded={eduOpen}
              >
                <svg
                  className={`${styles.chevron} ${eduOpen ? styles.chevronOpen : ""}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 4.5l3.5 3.5 3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Why this matters
              </button>
              {eduOpen && (
                <div className={styles.eduBody}>
                  <p className={styles.eduText}>{stage.educationalContent}</p>
                </div>
              )}
            </div>
          )}

          {/* Glossary terms */}
          {stage.glossaryTerms?.length > 0 && (
            <div className={styles.milestoneSection}>
              <div className={styles.milestoneSectionLabel}>Key Terms</div>
              <div className={styles.glossaryList}>
                {stage.glossaryTerms.map((g) => (
                  <GlossaryTerm
                    key={g.term}
                    term={g.term}
                    definition={g.definition}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mark complete / undo */}
          <div className={styles.milestoneCardFooter}>
            {isDone ? (
              <button
                className={styles.btnUndo}
                onClick={() => onUncomplete?.(stage.id)}
                aria-label={`Mark stage ${stageNumber} as incomplete`}
              >
                Mark Incomplete
              </button>
            ) : (
              <button
                className={styles.btnComplete}
                onClick={() => onComplete?.(stage.id)}
                aria-label={`Mark stage ${stageNumber} as complete`}
              >
                Mark as Complete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}