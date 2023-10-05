import { NavLink, useNavigate, useRouteLoaderData } from "react-router-dom";
import styles from "./MainNav.module.css";


export default function MainNav() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const navigate = useNavigate();

  async function handleClickLogOut () {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Unexpected status code.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      navigate(0);  // Refresh page to clear auth state and re-render
    }
  }

  return (
    <nav className={styles.mainNav}>
      <ul className={styles.navList}>
        <li className={styles.listItem}>
          <NavLink to="/" className={styles.link}>Home</NavLink>
        </li>
        <li className={styles.listItem}>
          <NavLink to="/category/books" className={styles.link}>Books</NavLink>
        </li>
        <li className={styles.listItem}>
          <NavLink to="/category/movies" className={styles.link}>Movies</NavLink>
        </li>
      </ul>
      
      {authData?.logged_in ?
      <ul className={styles.navList}>
        <li className={styles.listItem}>
          <NavLink to="/account" className={styles.link}>Account</NavLink>
        </li>
        <li className={styles.listItem}>
          <NavLink to="/cart" className={styles.link}>Cart</NavLink>
        </li>
        <li className={styles.listItem}>
          <NavLink to="#" onClick={handleClickLogOut} className={styles.link}>Log Out</NavLink>
        </li>
      </ul>
      :
      <ul className={styles.navList}>
        <li className={styles.listItem}>
          <NavLink to="/login" className={styles.link}>Log In</NavLink>
        </li>
        <li className={styles.listItem}>
          <NavLink to="/register" className={styles.link}>Register</NavLink>
        </li>
      </ul>
      }
    </nav>
  );
}
