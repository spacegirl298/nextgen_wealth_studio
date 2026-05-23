/*General-purpose content card container.
–	Props: title, subtitle, children, actions, variant (default/elevated/outlined)
–	Optional header with title + badge
–	Slot for action buttons in footer
–	Used throughout features as content panels
*/

import React from "react";
import styles from "../../styles/SelectionLayout.module.css";

export default function OverviewCard({
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
