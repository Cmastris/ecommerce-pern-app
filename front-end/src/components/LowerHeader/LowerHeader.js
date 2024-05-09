import SearchBar from "../SearchBar/SearchBar";

import styles from "./LowerHeader.module.css";


export default function LowerHeader() {
  return (
    <div className={styles.header}>
      <SearchBar />
    </div>
  );
}
