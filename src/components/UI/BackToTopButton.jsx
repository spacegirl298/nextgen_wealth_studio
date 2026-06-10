import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import styles from "./BackToTopButton.module.css";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={styles.button}
      aria-label="Back to top"
      title="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
