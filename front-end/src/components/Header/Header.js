import LowerHeader from "../LowerHeader/LowerHeader";
import UpperHeader from "../UpperHeader/UpperHeader";

import styles from "./Header.module.css";


export default function Header() {
  return (
    <header className={styles.header}>
      <UpperHeader />
      <LowerHeader />
    </header>
  );
}
