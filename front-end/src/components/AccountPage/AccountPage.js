import { useRouteLoaderData } from "react-router-dom";

import InlineErrorPage from "../InlineErrorPage/InlineErrorPage";
import InlineLink from "../InlineLink/InlineLink";
import { OrdersHistory } from "../../features/orders/OrdersHistory";


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
      <InlineLink path="/cart" anchor="Go to cart" />
      <h2>Your orders</h2>
      <OrdersHistory />
    </div>
  );
}
