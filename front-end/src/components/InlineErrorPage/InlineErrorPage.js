import { Link } from "react-router-dom";
import utilStyles from "../../App/utilStyles.module.css";


export default function InlineErrorPage({ pageName, type, message, loginRedirect }) {

  function renderMessage() {
    if (type === "login_required") {
      const path = loginRedirect ? `/login?redirect=${loginRedirect}` : "/login";
      const link = <Link to={path} className={utilStyles.link}>log in</Link>;
      return <p>Please {link} to view this page.</p>;
    } else {
      return <p>{message}</p>;
    }
  }

  return (
    <div className={utilStyles.pageXPadding}>
      <h1 className={utilStyles.h1}>{pageName}</h1>
      <div className={utilStyles.largeText}>
        {renderMessage()}
      </div>
    </div>
  );
}
