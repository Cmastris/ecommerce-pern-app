import InlineLink from "../InlineLink/InlineLink";
import utilStyles from "../../App/utilStyles.module.css";


type InlineErrorPageLoginErrorProps = {
  /** The type of error */
  type: "login_required",
  /** Optional: the page name to be rendered as an H1, otherwise "Error" */
  pageName?: string,
  message?: null,
  /** Optional: the URL path to redirect to after a successful login */
  loginRedirect?: string,
}

type InlineErrorPageOtherErrorProps = {
  /** The type of error */
  type?: "other",
  /** Optional: the page name to be rendered as an H1, otherwise "Error" */
  pageName?: string,
  /** An error message to render */
  message: string,
  loginRedirect?: null,
}


export default function InlineErrorPage(
  {
    type = "other",
    pageName = "Error",
    message = null,
    loginRedirect = null
  }: InlineErrorPageLoginErrorProps | InlineErrorPageOtherErrorProps
) {

  function renderMessage() {
    if (type === "login_required") {
      const path = loginRedirect ? `/login?redirect=${loginRedirect}` : "/login";
      const loginLink = <InlineLink path={path} anchor="log in" />;
      return <p>Please {loginLink} to view this page.</p>;
    } else {
      return <p>{message}</p>;
    }
  }

  return (
    <div className={utilStyles.pagePadding}>
      <h1 className={utilStyles.h1}>{pageName}</h1>
      <div className={utilStyles.largeText}>
        {renderMessage()}
      </div>
    </div>
  );
}
