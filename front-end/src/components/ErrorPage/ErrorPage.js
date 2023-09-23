import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <em>{error.statusText || error.message}</em>
      </p>
      <hr></hr>
      <h3>
        <Link to="/">Go to the homepage</Link>
      </h3>
    </div>
  );
}
