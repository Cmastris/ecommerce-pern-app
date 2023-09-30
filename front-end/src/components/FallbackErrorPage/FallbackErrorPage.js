import { Link, useRouteError } from "react-router-dom";

export default function FallbackErrorPage() {
  const error = useRouteError();
  const is404 = error.status === 404;
  console.error(error);

  return (
    <div>
      <h1>{is404 ? '404 (Not Found)' : 'Oops!'}</h1>
      <p>{is404 ? 'Sorry, this page does not exist.' : 'Sorry, an unexpected error has occurred.'}</p>
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
