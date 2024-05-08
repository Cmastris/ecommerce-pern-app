import { Link, useRouteError } from "react-router-dom";

import Header from "../Header/Header";
import utilStyles from "../../App/utilStyles.module.css";


export default function FallbackErrorPage() {

  const error = useRouteError();
  const is404 = error.status === 404;
  console.error(error);

  return (
    <>
      {is404 ? <Header /> : null}
      <main className={utilStyles.pagePadding}>
        <h1 className={utilStyles.h1}>{is404 ? "404 (Not Found)" : "Oops!"}</h1>
        <p>{is404 ? "Sorry, this page does not exist." : "Sorry, an unexpected error has occurred."}</p>
        <p>
          <em>{error.statusText || error.message}</em>
        </p>
        <hr className={utilStyles.separator}></hr>
        <Link to="/" className={utilStyles.button}>Visit the homepage</Link>
      </main>
    </>
  );
}
