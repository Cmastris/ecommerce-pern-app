import styles from "./GoogleAuthButton.module.css";

export default function GoogleAuthButton() {
  return (
      <button
        className={styles.googleBtn}
        onClick={() => window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/google`}
        >
        Sign in with Google
      </button>
  );
}
