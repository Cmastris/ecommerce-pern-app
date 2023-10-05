import MainNav from "../MainNav/MainNav";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Pernecom</div>
      <MainNav />
    </header>
  );
}
