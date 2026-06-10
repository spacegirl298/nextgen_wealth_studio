import styles from "../Snapshot.module.css";

export default function SectionCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`${styles.sectionCard} ${className}`.trim()}>
      {title && <h3 className={styles.cardTitle}>{title}</h3>}
      {subtitle && <p className={styles.cardSub}>{subtitle}</p>}
      {children}
    </section>
  );
}
