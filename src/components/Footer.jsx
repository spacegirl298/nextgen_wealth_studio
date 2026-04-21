import styles from './Footer.module.css'

const FOOTER_LINKS = [
  { label: 'Term & Conditions', href: 'https://www.absa.co.za/legal-and-compliance/terms-of-use/' },
  { label: 'Privacy Policy', href: 'https://www.absa.co.za/legal-and-compliance/privacy-statement/' },
  { label: 'Legal & Compliance', href: 'https://www.absa.co.za/legal-and-compliance/' },
  { label: 'Contact Us', href: 'https://www.absa.co.za/talk-to-us/' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <nav className={styles.links}>
          {FOOTER_LINKS.map((link, i) => (
            <span key={link.href} className={styles.linkGroup}>
              <a 
                href={link.href} 
                className={styles.link}
                target="_blank"  // Opens in new tab
                rel="noopener noreferrer"  // Security best practice
              >
                {link.label}
              </a>
              {i < FOOTER_LINKS.length - 1 && (
                <span className={styles.divider}>|</span>
              )}
            </span>
          ))}
        </nav>
        <p className={styles.copy}>
          © {new Date().getFullYear()} ABSA NextGen Wealth Studio
        </p>
      </div>
    </footer>
  )
}