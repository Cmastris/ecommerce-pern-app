import { Link } from "react-router-dom";

export default function InlineErrorPage({ pageName, type, message, loginRedirect }) {

  function renderMessage() {
    if (type === "login_required") {
      const path = loginRedirect ? `/login?redirect=${loginRedirect}` : '/login';
      return <p>Please <Link to={path}>log in</Link> to view this page.</p>;
    } else {
      return <p>{message}</p>;
    }
  }

  return (
    <div>
      <h1>{pageName}</h1>
      {renderMessage()}
    </div>
  );
}
