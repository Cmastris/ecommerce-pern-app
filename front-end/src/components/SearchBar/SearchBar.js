import { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import styles from "./SearchBar.module.css";


export default function SearchBar() {

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setSearchTerm(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();  // Remove whitespace before & after
    setSearchTerm(trimmedTerm);

    if (trimmedTerm.length > 0) {
      return navigate(`/search?q=${trimmedTerm}`);
    }
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        type="search"
        maxLength={60}
        placeholder="Search Pernecom"
        value={searchTerm}
        onChange={handleChange}
        className={styles.input}   
      />
      <button className={styles.btn} type="submit" aria-label="Search">
        <MdOutlineSearch className={styles.icon} />
      </button>
    </form>
  );
}
