import { Link, useRouteLoaderData } from "react-router-dom";
import InlineErrorPage from "../InlineErrorPage/InlineErrorPage";

export default function AccountPage() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");

  if (!authData.logged_in) {
    return <InlineErrorPage pageName="Your account" type="login_required" />;
  }

  return (
    <div>
      <h1>Your account</h1>
      <p>You are logged in as {authData.email_address}.</p>
      <Link to="/cart">Go to cart</Link>
    </div>
  );
}
