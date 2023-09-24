import { Link, useRouteLoaderData } from "react-router-dom";

export default function AccountPage() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");

  return (
    <div>
      <h1>Your account</h1>
      {!authData.logged_in ?
      <p>Please <Link to="/login">log in</Link> to view your account details and orders.</p>
      :
      <p>You are logged in as {authData.email_address}.</p>
      }
    </div>
  );
}
