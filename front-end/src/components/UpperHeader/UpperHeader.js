import { Link } from "react-router-dom";

import MainNav from "../MainNav/MainNav";
import styles from "./UpperHeader.module.css";


export default function UpperHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logo}>Pern<span className={styles.orange}>ecom</span></Link>
      </div>
      <MainNav />
    </div>
  );
}
