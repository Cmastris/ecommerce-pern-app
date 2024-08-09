import { useRouteLoaderData } from "react-router-dom";

import { AuthData } from "../../features/auth/authData";
import InlineErrorPage from "../InlineErrorPage/InlineErrorPage";
import InlineLink from "../InlineLink/InlineLink";
import { OrdersHistory } from "../../features/orders/OrdersHistory";
import utilStyles from "../../App/utilStyles.module.css";


export default function AccountPage() {
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app") as AuthData;

  if (!authData.logged_in) {
    return <InlineErrorPage pageName="Your account" type="login_required" />;
  }

  return (
    <div className={utilStyles.pagePadding}>
      <h1 className={utilStyles.h1}>Your account</h1>
      <p>You are logged in as {authData.email_address}.</p>
      <p className={utilStyles.mb3rem}>
        View your previous orders below or <InlineLink path="/cart" anchor="visit your cart" />.
      </p>
      <h2>Your orders</h2>
      <OrdersHistory />
    </div>
  );
}
