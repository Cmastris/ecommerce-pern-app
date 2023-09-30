import { Link, useRouteLoaderData } from "react-router-dom";

export default function AccountPage() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");

  if (!authData.logged_in) {
    return (
      <div>
        <h1>Your account</h1>
        <p>Please <Link to="/login">log in</Link> to view your account details and orders.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Your account</h1>
      <p>You are logged in as {authData.email_address}.</p>
      <Link to="/cart">Go to cart</Link>
    </div>
  );
}
